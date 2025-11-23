"""Agent tools for interacting with the PortFlow backend API.

Each function is exposed as a watsonx Orchestrate tool and wraps a
corresponding HTTP endpoint on the Django backend.
"""

import os

import requests
from ibm_watsonx_orchestrate.agent_builder.tools import tool


API_BASE = os.getenv("API_BASE", "http://127.0.0.1:8000/api")


@tool
def check_customs_status(container_id: str) -> dict:
    """Return the customs clearance status for a container.

    Wraps the backend customs status endpoint and returns any amount due.
    """

    try:
        response = requests.get(
            f"{API_BASE}/mock/customs", params={"container_id": container_id}
        )
        response.raise_for_status()
        return response.json()
    except requests.RequestException as exc: 
        return {"error": f"Failed to check customs status: {exc}"}


@tool
def check_shipping_status(container_id: str) -> dict:
    """Return the shipping line status for a container."""

    try:
        response = requests.get(
            f"{API_BASE}/mock/shipping", params={"container_id": container_id}
        )
        response.raise_for_status()
        return response.json()
    except requests.RequestException as exc: 
        return {"error": f"Failed to check shipping status: {exc}"}


@tool
def schedule_inspection(container_id: str) -> dict:
    """Schedule a physical inspection for a container with the NPA.

    This should only be called after customs duty is recorded as paid.
    """

    try:
        response = requests.get(
            f"{API_BASE}/mock/npa/schedule", params={"container_id": container_id}
        )
        response.raise_for_status()
        return response.json()
    except requests.RequestException as exc:  
        return {"error": f"Failed to schedule inspection: {exc}"}


@tool
def get_container_details(container_id: str) -> dict:
    """Retrieve full details and logs for a container."""

    try:
        response = requests.get(f"{API_BASE}/containers/{container_id}")
        response.raise_for_status()
        return response.json()
    except requests.RequestException as exc: 
        return {"error": f"Failed to get container details: {exc}"}
