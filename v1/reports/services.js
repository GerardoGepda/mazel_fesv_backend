import PDFDocument from 'pdfkit';
import { Buffer } from 'buffer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const LOGO_PATH = join(__dirname, 'logos', 'logo.png');

// const COLORS_TEMP = {
//     primary: '#1a3a5c',
//     secondary: '#2e7d9e',
//     accent: '#f0f4f8',
//     white: '#ffffff',
//     text: '#1a1a1a',
//     muted: '#555555',
//     border: '#c0cfe0',
//     tableHeader: '#1a3a5c',
//     tableRowAlt: '#f5f8fb',
// };

const COLORS = {
    primary: '#63ab30',
    secondary: '#f8b82a',
    accent: '#f9fff5',
    white: '#ffffff',
    text: '#1a1a1a',
    muted: '#555555',
    border: '#dbffc1',
    tableHeader: '#63ab30',
    tableRowAlt: '#f9fff5',
};

const LETTER = { width: 612, height: 792 };
const MARGIN = 40;
const CONTENT_WIDTH = LETTER.width - MARGIN * 2;

const formatDate = (rawDate) => {
    if (!rawDate) return '-';
    const d = new Date(rawDate);
    if (isNaN(d)) return rawDate;
    return d.toLocaleDateString('es-SV', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

const formatNumber = (val, decimals = 2) => {
    const n = parseFloat(val);
    if (isNaN(n)) return '-';
    return n.toLocaleString('es-SV', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
};

const drawHeader = (doc, header) => {
    const top = MARGIN;

    // Logo
    const logoSize = 70;
    doc.image(LOGO_PATH, MARGIN, top, { fit: [logoSize, logoSize], align: 'center', valign: 'center' });

    // Title block
    const titleX = MARGIN + logoSize + 16;
    const titleWidth = CONTENT_WIDTH - logoSize - 16;

    doc.rect(titleX, top, titleWidth, logoSize)
        .fill(COLORS.primary);

    doc.fontSize(18).fillColor(COLORS.white)
        .text('REPORTE DE BODEGA', titleX, top + 10, { width: titleWidth, align: 'center' });

    doc.fontSize(9).fillColor(COLORS.border)
        .text(`Generado el ${formatDate(new Date().toISOString())}`, titleX, top + 38, { width: titleWidth, align: 'center' });

    // Divider
    const dividerY = top + logoSize + 14;
    doc.rect(MARGIN, dividerY, CONTENT_WIDTH, 2).fill(COLORS.secondary);

    // Header info grid
    const infoY = dividerY + 10;
    const fields = [
        { label: 'N° Documento', value: header.DocNum },
        { label: 'N° de Control', value: header.NumAtCard },
        { label: 'Código de Cliente', value: header.CardCode },
        { label: 'Fecha', value: formatDate(header.DocDate) },
    ];

    const colWidth = CONTENT_WIDTH / 2;
    const rowHeight = 22;
    const gridFields = fields;

    gridFields.forEach((field, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = MARGIN + col * colWidth;
        const y = infoY + row * rowHeight;
        const bg = row % 2 === 0 ? COLORS.accent : COLORS.white;

        doc.rect(x, y, colWidth, rowHeight).fill(bg);

        doc.fontSize(7).fillColor(COLORS.muted)
            .text(field.label.toUpperCase(), x + 8, y + 4, { width: colWidth - 16 });
        doc.fontSize(9).fillColor(COLORS.text)
            .text(String(field.value ?? '-'), x + 8, y + 12, { width: colWidth - 16, ellipsis: true });
    });

    const fullWidthY = infoY + Math.ceil(gridFields.length / 2) * rowHeight;

    // CardName — full width
    doc.rect(MARGIN, fullWidthY, CONTENT_WIDTH, rowHeight + 6).fill(COLORS.accent);
    doc.fontSize(7).fillColor(COLORS.muted)
        .text('CLIENTE', MARGIN + 8, fullWidthY + 3, { width: CONTENT_WIDTH - 16 });
    doc.fontSize(9).fillColor(COLORS.text)
        .text(header.CardName ?? '-', MARGIN + 8, fullWidthY + 11, { width: CONTENT_WIDTH - 16, ellipsis: true });

    // Comments — full width
    const commentsY = fullWidthY + rowHeight + 6;
    doc.rect(MARGIN, commentsY, CONTENT_WIDTH, rowHeight + 6).fill(COLORS.white);
    doc.fontSize(7).fillColor(COLORS.muted)
        .text('COMENTARIOS', MARGIN + 8, commentsY + 3, { width: CONTENT_WIDTH - 16 });
    doc.fontSize(9).fillColor(COLORS.text)
        .text(header.Comments ?? '-', MARGIN + 8, commentsY + 11, { width: CONTENT_WIDTH - 16, ellipsis: true });

    // Bottom divider
    const bottomDividerY = commentsY + rowHeight + 6 + 8;
    doc.rect(MARGIN, bottomDividerY, CONTENT_WIDTH, 1).fill(COLORS.border);

    return bottomDividerY + 12;
};

const drawTableHeader = (doc, y) => {
    const cols = getColumns();
    let x = MARGIN;

    doc.rect(MARGIN, y, CONTENT_WIDTH, 18).fill(COLORS.tableHeader);

    cols.forEach((col) => {
        doc.fontSize(7.5).fillColor(COLORS.white)
            .text(col.label, x + 4, y + 5, { width: col.width - 8, align: col.align ?? 'left' });
        x += col.width;
    });

    return y + 18;
};

const getColumns = () => [
    { key: 'ItemCode',   label: 'Código',      width: 55,  align: 'left' },
    { key: 'Dscription', label: 'Descripción', width: 175, align: 'left' },
    { key: 'Warehouse',  label: 'Bodega',      width: 100, align: 'left' },
    { key: 'Quantity',   label: 'Cantidad',    width: 50,  align: 'right' },
    { key: 'Price',      label: 'Precio',      width: 55,  align: 'right' },
    { key: 'DiscPrcnt',  label: 'Desc. %',     width: 45,  align: 'right' },
    { key: 'LineTotal',  label: 'Total',        width: 52,  align: 'right' },
];

const ROW_HEIGHT = 32;

const drawRow = (doc, row, y, isAlt) => {
    const cols = getColumns();
    const bg = isAlt ? COLORS.tableRowAlt : COLORS.white;
    let x = MARGIN;

    doc.rect(MARGIN, y, CONTENT_WIDTH, ROW_HEIGHT).fill(bg);

    const values = {
        ItemCode: row.ItemCode ?? '-',
        Dscription: row.Dscription ?? '-',
        Warehouse: `${row.WhsCode ?? '-'} - ${row.WhsName ?? '-'}`,
        Quantity: formatNumber(row.Quantity, 3),
        Price: `$${formatNumber(row.Price)}`,
        DiscPrcnt: `${formatNumber(row.DiscPrcnt, 2)}%`,
        LineTotal: `$${formatNumber(row.LineTotal)}`,
    };

    cols.forEach((col) => {
        const isMultiLine = col.key === 'Dscription' || col.key === 'Warehouse';
        doc.fontSize(8).fillColor(COLORS.text)
            .text(values[col.key], x + 4, y + 8, {
                width: col.width - 8,
                height: ROW_HEIGHT - 10,
                align: col.align ?? 'left',
                lineBreak: isMultiLine,
                ellipsis: true,
            });
        x += col.width;
    });

    // bottom border
    doc.rect(MARGIN, y + ROW_HEIGHT - 1, CONTENT_WIDTH, 0.5).fill(COLORS.border);

    return y + ROW_HEIGHT;
};

const drawFooter = (doc, pageNum, totalPages) => {
    const y = LETTER.height - MARGIN - 14;
    doc.rect(MARGIN, y - 4, CONTENT_WIDTH, 0.5).fill(COLORS.secondary);
    doc.fontSize(7.5).fillColor(COLORS.muted)
        .text(`Página ${pageNum} de ${totalPages}`, MARGIN, y + 2, { width: CONTENT_WIDTH, align: 'right' });
};

export const generateWarehouseReportPdf = async (data) => {
    if (!data || data.length === 0) {
        throw new Error('No hay datos para generar el reporte.');
    }
    
    const doc = new PDFDocument({ size: 'LETTER', margin: MARGIN, autoFirstPage: false, bufferPages: true });
    const buffers = [];

    const pdfBuffer = new Promise((resolve, reject) => {
        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);
    });

        const header = data[0];
        const rows = data;
        const maxY = LETTER.height - MARGIN - 35;

        let pageNum = 0;
        let rowIndex = 0;
        let currentY = 0;
        let isFirstPage = true;
        const pageYPositions = []; // guarda Y del footer por página para actualizarlo al final

        const addPage = () => {
            doc.addPage({ size: 'LETTER', margin: MARGIN });
            pageNum++;
            pageYPositions.push(pageNum);

            if (isFirstPage) {
                currentY = drawHeader(doc, header);
                isFirstPage = false;
            } else {
                currentY = MARGIN;
            }

            currentY = drawTableHeader(doc, currentY);
        };

        addPage();

        const TOTAL_ROW_HEIGHT = 22;

        while (rowIndex < rows.length) {
            const isLastRow = rowIndex === rows.length - 1;
            const spaceNeeded = isLastRow
                ? ROW_HEIGHT + 4 + TOTAL_ROW_HEIGHT  // última fila + margen + total
                : ROW_HEIGHT;

            if (currentY + spaceNeeded > maxY) {
                addPage();
            }
            currentY = drawRow(doc, rows[rowIndex], currentY, rowIndex % 2 !== 0);
            rowIndex++;
        }

        // Totals row — siempre cabe porque el while reservó el espacio
        const total = rows.reduce((sum, r) => sum + parseFloat(r.LineTotal || 0), 0);
        const totalsY = currentY + 4;

        const totalColWidth = 90;
        doc.rect(MARGIN, totalsY, CONTENT_WIDTH, TOTAL_ROW_HEIGHT).fill(COLORS.primary);
        doc.fontSize(9).fillColor(COLORS.white)
            .text('TOTAL', MARGIN + 4, totalsY + 7, { width: CONTENT_WIDTH - totalColWidth - 4, align: 'right' });
        doc.fontSize(9).fillColor(COLORS.white)
            .text(`$${formatNumber(total)}`, MARGIN + CONTENT_WIDTH - totalColWidth, totalsY + 7, { width: totalColWidth - 4, align: 'right' });

        // Dibuja footers ahora que sabemos el total de páginas
        const totalPages = pageNum;
        for (let p = 1; p <= totalPages; p++) {
            doc.switchToPage(p - 1);
            drawFooter(doc, p, totalPages);
        }

        doc.end();

    return pdfBuffer;
};
