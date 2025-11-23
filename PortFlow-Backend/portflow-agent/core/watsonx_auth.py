"""
Authentication utilities for IBM watsonx Orchestrate integration
"""
import os
import jwt
import time
from datetime import datetime, timedelta
from typing import Dict
from decouple import config


class WatsonxAuthManager:
    """Manages authentication tokens for watsonx Orchestrate widget"""
    
    def __init__(self):
        # Load from environment variables
        self.orchestration_id = config('WATSONX_ORCHESTRATION_ID')
        self.agent_id = config('WATSONX_AGENT_ID')
        self.host_url = config('WATSONX_HOST_URL')
        self.secret_key = config('WATSONX_SECRET_KEY')
    
    def generate_session_token(self, user_id: str = None, session_data: Dict = None) -> Dict:
        """
        Generate a session token for the watsonx widget
        
        Args:
            user_id: Optional user identifier
            session_data: Optional session metadata
            
        Returns:
            Dictionary containing token and configuration
        """
        # Generate a unique session ID
        session_id = f"portflow_{int(time.time())}"
        
        if user_id:
            session_id = f"{session_id}_{user_id}"
        

        # In production, we will implement the use IBM IAM tokens
        payload = {
            'session_id': session_id,
            'orchestration_id': self.orchestration_id,
            'agent_id': self.agent_id,
            'iat': datetime.utcnow(),
            'exp': datetime.utcnow() + timedelta(hours=24), 
        }
        
        if session_data:
            payload['metadata'] = session_data
        
        # Generate JWT token
        token = jwt.encode(payload, self.secret_key, algorithm='HS256')
        
        return {
            'token': token,
            'session_id': session_id,
            'orchestration_id': self.orchestration_id,
            'agent_id': self.agent_id,
            'host_url': self.host_url,
            'expires_in': 86400, 
        }
    
    def get_widget_config(self, anonymous: bool = True) -> Dict:
        """
        Get widget configuration for frontend
        
        Args:
            anonymous: Whether to allow anonymous access (for demo)
            
        Returns:
            Widget configuration dictionary
        """
        config = {
            'orchestrationID': self.orchestration_id,
            'hostURL': self.host_url,
            'chatOptions': {
                'agentId': self.agent_id,
            }
        }
        
        if not anonymous:
            config['chatOptions']['enableAuth'] = True
            config['chatOptions']['tokenEndpoint'] = '/api/watsonx/token'
        
        return config


# Global instance
auth_manager = WatsonxAuthManager()
