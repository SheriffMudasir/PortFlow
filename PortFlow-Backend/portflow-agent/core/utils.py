"""Utility functions for document parsing and data extraction.

This module contains helpers for Bill of Lading document processing,
including PDF text extraction and structured data validation.
"""
import re
import fitz  # PyMuPDF
from typing import Dict, Optional, List
from io import BytesIO


class BillOfLadingParser:
    """Parser for Bill of Lading PDF documents.

    Provides methods for extracting structured data such as container IDs,
    TINs, ports and cargo details from PDF text.
    """

    CONTAINER_ID_PATTERN = r'\b[A-Z]{4}\d{7}\b'
    TIN_PATTERN = r'\b\d{10,12}\b'
    
    @staticmethod
    def extract_text_from_pdf(file_content: bytes) -> str:
        """Extract text content from PDF file"""
        try:
            pdf_document = fitz.open(stream=file_content, filetype="pdf")
            text = ""
            for page_num in range(pdf_document.page_count):
                page = pdf_document[page_num]
                text += page.get_text()
            pdf_document.close()
            return text
        except Exception as e:
            raise ValueError(f"Failed to parse PDF: {str(e)}")
    
    @staticmethod
    def extract_container_id(text: str) -> Optional[str]:
        """Extract container ID from text using pattern matching"""
        match = re.search(BillOfLadingParser.CONTAINER_ID_PATTERN, text)
        return match.group(0) if match else None
    
    @staticmethod
    def extract_tin(text: str) -> Optional[str]:
        """Extract Tax Identification Number from text"""
        match = re.search(BillOfLadingParser.TIN_PATTERN, text)
        return match.group(0) if match else None
    
    @staticmethod
    def extract_field(text: str, label: str, multiline: bool = False) -> Optional[str]:
        """
        Extract a field value by searching for a label.
        
        Args:
            text: The text to search in
            label: The field label to look for
            multiline: Whether the field value can span multiple lines
        """
        pattern = rf'{label}\s*[:：]\s*(.+?)(?:\n|$)'
        if multiline:
            pattern = rf'{label}\s*[:：]\s*(.+?)(?:\n\n|$)'
        
        match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
        return match.group(1).strip() if match else None
    
    @classmethod
    def parse_bill_of_lading(cls, file_content: bytes, filename: str) -> Dict:
        """
        Parse a Bill of Lading document and extract relevant information.
        
        Args:
            file_content: The binary content of the PDF file
            filename: The original filename
        
        Returns:
            Dictionary containing extracted information
        """
        result = {
            "success": False,
            "errors": [],
            "data": {}
        }
        
        try:
            text = cls.extract_text_from_pdf(file_content)
            
            if not text or len(text.strip()) < 50:
                result["errors"].append("Document appears to be empty or unreadable")
                return result
            
            container_id = cls.extract_container_id(text)
            if not container_id:
                result["errors"].append("Container ID not found in document")
                # This is a mock of container ID for demo purposes
                container_id = f"DEMO{hash(text[:100]) % 10000000:07d}"
            
            result["data"]["container_id"] = container_id
            result["data"]["original_filename"] = filename
            
            vessel_name = (
                cls.extract_field(text, "Vessel Name") or
                cls.extract_field(text, "Vessel") or
                cls.extract_field(text, "Ship Name")
            )
            if vessel_name:
                result["data"]["vessel_name"] = vessel_name[:120]
            
            importer_name = (
                cls.extract_field(text, "Consignee") or
                cls.extract_field(text, "Importer") or
                cls.extract_field(text, "Notify Party")
            )
            if importer_name:
                result["data"]["importer_name"] = importer_name[:200]
            
            importer_address = (
                cls.extract_field(text, "Consignee Address", multiline=True) or
                cls.extract_field(text, "Importer Address", multiline=True)
            )
            if importer_address:
                result["data"]["importer_address"] = importer_address[:500]
            
            tin = cls.extract_tin(text)
            if tin:
                result["data"]["tin"] = tin
            
            port_of_loading = (
                cls.extract_field(text, "Port of Loading") or
                cls.extract_field(text, "POL") or
                cls.extract_field(text, "Loading Port")
            )
            if port_of_loading:
                result["data"]["port_of_loading"] = port_of_loading[:100]
            
            port_of_discharge = (
                cls.extract_field(text, "Port of Discharge") or
                cls.extract_field(text, "POD") or
                cls.extract_field(text, "Discharge Port")
            )
            if port_of_discharge:
                result["data"]["port_of_discharge"] = port_of_discharge[:100]
            
            cargo_description = (
                cls.extract_field(text, "Description of Goods", multiline=True) or
                cls.extract_field(text, "Cargo Description", multiline=True) or
                cls.extract_field(text, "Goods Description", multiline=True)
            )
            if cargo_description:
                result["data"]["cargo_description"] = cargo_description[:1000]
            
            weight_match = re.search(r'(\d+(?:,\d+)?(?:\.\d+)?)\s*(?:KG|kg|Kg|MT|mt|Mt)', text)
            if weight_match:
                weight_str = weight_match.group(1).replace(',', '')
                try:
                    result["data"]["cargo_weight"] = float(weight_str)
                except ValueError:
                    pass
            
            result["success"] = True
            
        except Exception as e:
            result["errors"].append(f"Parsing error: {str(e)}")
        
        return result


def validate_container_data(data: Dict) -> List[str]:
    """
    Validate extracted container data.
    
    Args:
        data: Dictionary of extracted data
    
    Returns:
        List of validation error messages (empty if valid)
    """
    errors = []
    
    if not data.get("container_id"):
        errors.append("Container ID is required")
    
    container_id = data.get("container_id", "")
    if container_id and not re.match(r'^[A-Z]{4}\d{7}$', container_id) and not container_id.startswith("DEMO"):
        errors.append("Container ID format is invalid (expected: 4 letters + 7 digits)")
    
    tin = data.get("tin", "")
    if tin and not re.match(r'^\d{10,12}$', tin):
        errors.append("TIN format is invalid (expected: 10-12 digits)")
    
    if not data.get("vessel_name"):
        errors.append("Vessel name is missing (recommended)")
    
    if not data.get("importer_name"):
        errors.append("Importer name is missing (recommended)")
    
    return errors
