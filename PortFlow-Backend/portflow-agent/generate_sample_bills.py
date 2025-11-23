"""
Generate sample Bill of Lading PDFs for testing
"""
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from datetime import datetime, timedelta

def create_bill_of_lading(filename, data):
    """Create a Bill of Lading PDF with the given data"""
    c = canvas.Canvas(filename, pagesize=A4)
    width, height = A4
    
    # Title
    c.setFont("Helvetica-Bold", 20)
    c.drawCentredString(width/2, height - 50, "BILL OF LADING")
    
    # Shipping line logo area
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, height - 90, data['shipping_line'])
    
    # B/L Number
    c.setFont("Helvetica", 10)
    c.drawString(width - 200, height - 90, f"B/L No: {data['bl_number']}")
    c.drawString(width - 200, height - 105, f"Date: {data['bl_date']}")
    
    # Horizontal line
    c.line(50, height - 120, width - 50, height - 120)
    
    y = height - 150
    
    # Shipper section
    c.setFont("Helvetica-Bold", 11)
    c.drawString(50, y, "SHIPPER:")
    c.setFont("Helvetica", 10)
    y -= 15
    for line in data['shipper'].split('\n'):
        c.drawString(50, y, line)
        y -= 12
    
    y -= 10
    
    # Consignee section
    c.setFont("Helvetica-Bold", 11)
    c.drawString(50, y, "CONSIGNEE:")
    c.setFont("Helvetica", 10)
    y -= 15
    for line in data['consignee'].split('\n'):
        c.drawString(50, y, line)
        y -= 12
    
    # TIN
    if data.get('tin'):
        c.drawString(50, y, f"TIN: {data['tin']}")
        y -= 12
    
    y -= 10
    
    # Notify Party
    c.setFont("Helvetica-Bold", 11)
    c.drawString(50, y, "NOTIFY PARTY:")
    c.setFont("Helvetica", 10)
    y -= 15
    c.drawString(50, y, "Same as Consignee")
    y -= 20
    
    # Vessel and Voyage
    c.setFont("Helvetica-Bold", 11)
    c.drawString(50, y, "VESSEL NAME:")
    c.setFont("Helvetica", 10)
    c.drawString(180, y, data['vessel_name'])
    y -= 15
    
    c.setFont("Helvetica-Bold", 11)
    c.drawString(50, y, "VOYAGE NO:")
    c.setFont("Helvetica", 10)
    c.drawString(180, y, data['voyage_no'])
    y -= 20
    
    # Port information
    c.setFont("Helvetica-Bold", 11)
    c.drawString(50, y, "PORT OF LOADING:")
    c.setFont("Helvetica", 10)
    c.drawString(180, y, data['port_of_loading'])
    y -= 15
    
    c.setFont("Helvetica-Bold", 11)
    c.drawString(50, y, "PORT OF DISCHARGE:")
    c.setFont("Helvetica", 10)
    c.drawString(180, y, data['port_of_discharge'])
    y -= 20
    
    # Container information
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "CONTAINER DETAILS:")
    y -= 20
    
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, y, "Container No:")
    c.drawString(200, y, "Seal No:")
    c.drawString(320, y, "Size/Type:")
    c.drawString(420, y, "Weight:")
    y -= 15
    
    c.setFont("Helvetica", 10)
    c.drawString(50, y, data['container_id'])
    c.drawString(200, y, data['seal_no'])
    c.drawString(320, y, data['container_size'])
    c.drawString(420, y, f"{data['cargo_weight']} KG")
    y -= 25
    
    # Cargo description
    c.setFont("Helvetica-Bold", 11)
    c.drawString(50, y, "DESCRIPTION OF GOODS:")
    y -= 15
    c.setFont("Helvetica", 10)
    
    # Wrap cargo description
    desc_lines = data['cargo_description'].split('\n')
    for line in desc_lines:
        if len(line) > 80:
            # Simple word wrap
            words = line.split()
            current_line = ""
            for word in words:
                if len(current_line + word) < 80:
                    current_line += word + " "
                else:
                    c.drawString(50, y, current_line.strip())
                    y -= 12
                    current_line = word + " "
            if current_line:
                c.drawString(50, y, current_line.strip())
                y -= 12
        else:
            c.drawString(50, y, line)
            y -= 12
    
    y -= 10
    
    # Number of packages
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, y, f"NUMBER OF PACKAGES: {data['num_packages']}")
    y -= 15
    
    # Freight terms
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, y, f"FREIGHT: {data['freight_terms']}")
    y -= 30
    
    # Footer
    c.line(50, y, width - 50, y)
    y -= 20
    
    c.setFont("Helvetica", 8)  # Changed from Helvetica-Italic
    c.drawString(50, y, "This Bill of Lading is subject to the terms and conditions stated on the reverse side hereof.")
    y -= 12
    c.drawString(50, y, f"Issued at Lagos, Nigeria on {data['bl_date']}")
    y -= 20
    
    c.setFont("Helvetica-Bold", 10)
    c.drawString(width - 200, y, "For " + data['shipping_line'])
    y -= 30
    c.drawString(width - 200, y, "_______________________")
    y -= 12
    c.drawString(width - 200, y, "Authorized Signature")
    
    c.save()
    print(f"Created: {filename}")


# Sample data for 3 different Bills of Lading
samples = [
    {
        'filename': 'sample_bol_electronics.pdf',
        'shipping_line': 'MAERSK LINE',
        'bl_number': 'MAEU456789012',
        'bl_date': (datetime.now() - timedelta(days=15)).strftime('%Y-%m-%d'),
        'shipper': 'Shanghai Electronics Co., Ltd.\n1288 Nanjing Road\nShanghai 200001, China',
        'consignee': 'TechMart Nigeria Limited\n45 Allen Avenue, Ikeja\nLagos, Nigeria',
        'tin': '1234567890',
        'vessel_name': 'MAERSK SHANGHAI',
        'voyage_no': 'MSH-234',
        'port_of_loading': 'Shanghai, China',
        'port_of_discharge': 'Apapa Port, Lagos',
        'container_id': 'MAEU4567890',
        'seal_no': 'MSL789456',
        'container_size': '40ft HC',
        'cargo_weight': '18500',
        'cargo_description': 'Consumer Electronics\n250 Cartons containing:\n- LED Televisions (43", 55", 65")\n- Laptop Computers\n- Mobile Phones\n- Accessories\n\nHS Code: 8528.72\nValue: USD 125,000',
        'num_packages': '250 CARTONS',
        'freight_terms': 'PREPAID'
    },
    {
        'filename': 'sample_bol_textiles.pdf',
        'shipping_line': 'MSC (Mediterranean Shipping Company)',
        'bl_number': 'MSCU789012345',
        'bl_date': (datetime.now() - timedelta(days=8)).strftime('%Y-%m-%d'),
        'shipper': 'Mumbai Textiles Export House\nAndheri East, Mumbai 400069\nMaharashtra, India',
        'consignee': 'Fashion Plus Nigeria Ltd\n123 Balogun Street, Lagos Island\nLagos, Nigeria',
        'tin': '9876543210',
        'vessel_name': 'MSC DIANA',
        'voyage_no': 'MD-567',
        'port_of_loading': 'Nhava Sheva (JNPT), Mumbai',
        'port_of_discharge': 'Tin Can Island Port, Lagos',
        'container_id': 'MSCU7890123',
        'seal_no': 'MSC456123',
        'container_size': '20ft GP',
        'cargo_weight': '12300',
        'cargo_description': 'Textile Materials\n180 Bales of:\n- Cotton Fabrics (Ankara prints)\n- Polyester Materials\n- Lace Materials\n- Fashion Accessories\n\nHS Code: 5407.61\nValue: USD 45,000',
        'num_packages': '180 BALES',
        'freight_terms': 'COLLECT'
    },
    {
        'filename': 'sample_bol_machinery.pdf',
        'shipping_line': 'CMA CGM',
        'bl_number': 'CMAU123456789',
        'bl_date': (datetime.now() - timedelta(days=22)).strftime('%Y-%m-%d'),
        'shipper': 'German Industrial GmbH\nIndustriestrasse 45\n20095 Hamburg, Germany',
        'consignee': 'Nigeria Manufacturing Corp.\n78 Ikorodu Road, Ikeja\nLagos, Nigeria',
        'tin': '5544332211',
        'vessel_name': 'CMA CGM TAURUS',
        'voyage_no': 'CT-890',
        'port_of_loading': 'Hamburg, Germany',
        'port_of_discharge': 'Apapa Port, Lagos',
        'container_id': 'CMAU1234567',
        'seal_no': 'CMA987654',
        'container_size': '40ft GP',
        'cargo_weight': '22400',
        'cargo_description': 'Industrial Machinery Parts\n1 x Complete Production Line Equipment:\n- CNC Milling Machine (1 unit)\n- Industrial Press (2 units)\n- Spare Parts and Tools\n- Installation Manuals\n\nHS Code: 8459.10\nValue: USD 285,000',
        'num_packages': '3 CRATES + LOOSE ITEMS',
        'freight_terms': 'PREPAID'
    }
]

# Generate all sample PDFs
if __name__ == '__main__':
    print("Generating sample Bill of Lading PDFs...")
    for sample in samples:
        filename = sample.pop('filename')
        create_bill_of_lading(filename, sample)
    
    print("\n✅ All sample Bills of Lading created successfully!")
    print("\nContainer IDs created:")
    print("1. MAEU4567890 - Electronics shipment")
    print("2. MSCU7890123 - Textiles shipment")
    print("3. CMAU1234567 - Machinery shipment")
