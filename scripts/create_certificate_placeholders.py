from pathlib import Path

public = Path(__file__).resolve().parent.parent / 'public'
public.mkdir(exist_ok=True)

certificates = {
    'salesforce-agentforce-specialist.pdf': 'Salesforce Agentforce Specialist certificate placeholder. Replace this file with your actual PDF certificate.',
    'automation-anywhere-advanced-automation-professional.pdf': 'Automation Anywhere Certified Advanced Automation Professional certificate placeholder. Replace this file with your actual PDF certificate.',
}

for filename, text in certificates.items():
    content = f"BT /F1 24 Tf 72 720 Td ({text}) Tj ET\n"
    contents = content.encode('latin-1')
    objects = []
    objects.append(b"%PDF-1.4\n")
    objects.append(b"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n")
    objects.append(b"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n")
    objects.append(b"3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n")
    objects.append(b"4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n")
    objects.append(b"5 0 obj\n<< /Length %d >>\nstream\n" % len(contents) + contents + b"endstream\nendobj\n")
    pdf_data = b"".join(objects)
    xref = b"xref\n0 6\n0000000000 65535 f \n"
    offset = 0
    for obj in objects:
        xref += f"{offset:010d} 00000 n \n".encode('latin-1')
        offset += len(obj)
    trailer = (
        b"trailer\n<< /Size 6 /Root 1 0 R >>\n"
        + b"startxref\n"
        + str(len(pdf_data)).encode('latin-1')
        + b"\n%%EOF\n"
    )
    output_path = public / filename
    output_path.write_bytes(pdf_data + xref + trailer)
    print(f"Created {output_path}")
