async function carregarDados() {
    const response = await fetch('./json/pans.json');
    const json = await response.json();
    return json.pans;
}

function formatarEndereco(endereco) {
    return `${endereco.rua}, ${endereco.numero} - ${endereco.bairro}, ${endereco.cidade} - ${endereco.estado} (${endereco.cep})`;
}

function traduzirStatus(status) {
    const mapa = {
    not_started: 'Não iniciado',
    in_progress: 'Em andamento',
    completed: 'Concluído',
    suspended: 'Suspenso',
    awaiting: 'Aguardando'
    };
    return mapa[status] || status;
}

async function baixarCSV() {
    const pans = await carregarDados();
    const linhas = [];

    pans.forEach(pan => {
    linhas.push(`\nPAN: ${pan.title}`);
    linhas.push('PAN,Objetivo,Ação,Status,Custo Previsto,Valor Gasto,Endereço');

    pan.specificObjectives.forEach(obj => {
        obj.actions.forEach(acao => {
        linhas.push([
            `"${pan.title}"`,
            `"${obj.title}"`,
            `"${acao.description}"`,
            `"${traduzirStatus(acao.status)}"`,
            acao.custo_previsto,
            acao.valor_gasto,
            `"${formatarEndereco(acao.endereco)}"`
        ].join(','));
        });
    });

    linhas.push('');
    });

    const csv = linhas.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'acoes_pan.csv';
    a.click();
    URL.revokeObjectURL(url);
}

async function baixarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pans = await carregarDados();

    pans.forEach((pan, index) => {
    if (index > 0) doc.addPage();

    doc.setFontSize(14);
    doc.setTextColor(51, 153, 102);
    doc.text(`PAN: ${pan.title}`, 14, 10);

    const rows = [];

    pan.specificObjectives.forEach(obj => {
        obj.actions.forEach(acao => {
        rows.push([
            obj.title,
            acao.description,
            traduzirStatus(acao.status),
            `R$ ${acao.custo_previsto.toLocaleString()}`,
            `R$ ${acao.valor_gasto.toLocaleString()}`,
            formatarEndereco(acao.endereco)
        ]);
        });
    });

    doc.autoTable({
        head: [['Objetivo', 'Ação', 'Status', 'Custo Previsto', 'Valor Gasto', 'Endereço']],
        body: rows,
        startY: 16,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [51, 153, 102] },
        theme: 'grid'
    });
    });

    doc.save('acoes_pan.pdf');
}


function toggleExportMenu() {
    const menu = document.getElementById('export-menu');
    menu.classList.toggle('hidden');
}

//mrnu
document.addEventListener('click', function (e) {
    const isButton = e.target.closest('button');
    const menu = document.getElementById('export-menu');
    if (
    !e.target.closest('#export-menu') &&
    !isButton?.onclick?.toString().includes('toggleExportMenu')
    ) {
    menu.classList.add('hidden');
    }
});