#!/usr/bin/env python3
"""Render docs/billing.md into a shareable PDF. Requires reportlab.

Run: uv run --with reportlab python scripts/build-billing-brief.py
Render the result with pdftoppm and inspect each page before delivery.
"""

from html import escape
from pathlib import Path
import re

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.platypus import (
    PageBreak, Paragraph, SimpleDocTemplate, Table, TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'docs/billing.md'
OUTPUT = ROOT / 'output/pdf/ha-long-billing-brief.pdf'
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
PAGE_WIDTH, PAGE_HEIGHT = A4
MARGIN = 43
WIDTH = PAGE_WIDTH - 2 * MARGIN

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(
    name='BriefTitle', fontName='Helvetica-Bold', fontSize=23, leading=27,
    textColor=colors.black, spaceAfter=12,
))
styles.add(ParagraphStyle(
    name='BriefHeading', fontName='Helvetica-Bold', fontSize=13, leading=16,
    textColor=colors.black, spaceBefore=10, spaceAfter=7, keepWithNext=True,
))
styles.add(ParagraphStyle(
    name='BriefBody', fontName='Helvetica', fontSize=10, leading=14,
    textColor=colors.HexColor('#26362e'), spaceAfter=8,
))
styles.add(ParagraphStyle(
    name='BriefBullet', parent=styles['BriefBody'], leftIndent=12,
    firstLineIndent=-9, spaceAfter=5,
))
styles.add(ParagraphStyle(
    name='BriefCell', parent=styles['BriefBody'], fontSize=9.2, leading=12.3,
    spaceAfter=0, alignment=TA_LEFT,
))
styles.add(ParagraphStyle(
    name='BriefTableHeader', parent=styles['BriefCell'], fontName='Helvetica-Bold',
    textColor=colors.white,
))


def inline(text):
    """Convert this brief's small Markdown subset to safe ReportLab markup."""
    text = escape(text)
    text = re.sub(
        r'\[([^\]]+)\]\((https?://[^\s)]+)\)',
        r'<a href="\2" color="#245849"><u>\1</u></a>', text,
    )
    text = re.sub(r'\*\*([^*]+)\*\*', r'<b>\1</b>', text)
    return re.sub(r'`([^`]+)`', r'<font name="Courier">\1</font>', text)


def table(rows):
    count = len(rows[0])
    fractions = {2: [0.32, 0.68], 3: [0.27, 0.15, 0.58],
                 4: [0.28, 0.22, 0.20, 0.30], 5: [0.20] * 5}
    widths = [WIDTH * fraction for fraction in fractions.get(count, [1/count] * count)]
    data = [[Paragraph(inline(cell), styles['BriefTableHeader' if i == 0 else 'BriefCell'])
             for cell in row] for i, row in enumerate(rows)]
    result = Table(data, colWidths=widths, repeatRows=1, hAlign='LEFT', spaceAfter=10)
    result.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#244f40')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor('#f1f4ee'), colors.white]),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 7),
        ('RIGHTPADDING', (0, 0), (-1, -1), 7),
        ('TOPPADDING', (0, 0), (-1, -1), 7),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
        ('LINEBELOW', (0, -1), (-1, -1), .4, colors.HexColor('#cad6cb')),
    ]))
    return result


def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont('Helvetica', 8)
    canvas.setFillColor(colors.HexColor('#6e7c70'))
    canvas.drawString(MARGIN, 26, 'Ha Noi guide  |  Billing brief  |  Verification dates in source')
    canvas.drawRightString(PAGE_WIDTH - MARGIN, 26, f'Page {doc.page}')
    canvas.restoreState()


def build():
    story = []
    lines = SOURCE.read_text().splitlines()
    index = 0
    while index < len(lines):
        line = lines[index].strip()
        if not line:
            index += 1
            continue
        if line == '<!-- pagebreak -->':
            story.append(PageBreak())
        elif line.startswith('# '):
            story.append(Paragraph(inline(line[2:]), styles['BriefTitle']))
        elif line.startswith('## '):
            story.append(Paragraph(inline(line[3:]), styles['BriefHeading']))
        elif line.startswith('|'):
            rows = []
            while index < len(lines) and lines[index].strip().startswith('|'):
                cells = [cell.strip() for cell in lines[index].strip().strip('|').split('|')]
                if not all(re.fullmatch(r':?-+:?', cell) for cell in cells):
                    rows.append(cells)
                index += 1
            story.append(table(rows))
            continue
        elif line.startswith('- '):
            story.append(Paragraph('- ' + inline(line[2:]), styles['BriefBullet']))
        else:
            paragraph = [line]
            while index + 1 < len(lines) and lines[index + 1].strip() and not lines[index + 1].startswith(('#', '|', '- ', '<!--')):
                index += 1
                paragraph.append(lines[index].strip())
            story.append(Paragraph(inline(' '.join(paragraph)), styles['BriefBody']))
        index += 1
    document = SimpleDocTemplate(
        str(OUTPUT), pagesize=A4, rightMargin=MARGIN, leftMargin=MARGIN,
        topMargin=38, bottomMargin=43,
        title='Ha Noi guide billing and service options',
        author='Ha Noi guide project',
    )
    document.build(story, onFirstPage=footer, onLaterPages=footer)
    print(OUTPUT)


if __name__ == '__main__':
    build()
