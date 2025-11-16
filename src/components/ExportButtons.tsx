import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Risk } from '../types/types';

interface ExportButtonsProps {
  risks: Risk[];
  filteredRisks: Risk[];
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ risks, filteredRisks }) => {
  
  const exportToJSON = () => {
    const dataStr = JSON.stringify(filteredRisks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `risks-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Risk Management Report', 14, 20);
    
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
    
    const highRisks = filteredRisks.filter(r => r.totalRiskScore > 12).length;
    const mediumRisks = filteredRisks.filter(r => r.totalRiskScore >= 7 && r.totalRiskScore <= 12).length;
    const lowRisks = filteredRisks.filter(r => r.totalRiskScore <= 6).length;
    
    doc.setFontSize(12);
    doc.text('Summary:', 14, 38);
    doc.setFontSize(10);
    doc.text(`Total Risks: ${filteredRisks.length}`, 14, 45);
    doc.text(`High (13+): ${highRisks}`, 14, 52);
    doc.text(`Medium (7-12): ${mediumRisks}`, 14, 59);
    doc.text(`Low (1-6): ${lowRisks}`, 14, 66);
    
    const tableData = filteredRisks.map(risk => [
      risk.category,
      risk.risk.length > 60 ? risk.risk.substring(0, 57) + '...' : risk.risk,
      risk.probability.toString(),
      risk.impact.toString(),
      risk.totalRiskScore.toString(),
      risk.status,
    ]);
    
    autoTable(doc, {
      startY: 75,
      head: [['Category', 'Risk', 'Prob', 'Impact', 'Score', 'Status', 'Owner']],
      body: tableData,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 70 },
        2: { cellWidth: 15 },
        3: { cellWidth: 15 },
        4: { cellWidth: 15 },
        5: { cellWidth: 20 },
        6: { cellWidth: 20 }
      },
      didDrawCell: (data) => {
        if (data.column.index === 4 && data.section === 'body') {
          const score = parseInt(data.cell.text[0]);
          if (score > 12) {
            doc.setFillColor(239, 68, 68); // red
          } else if (score >= 7) {
            doc.setFillColor(234, 179, 8); // yellow
          } else {
            doc.setFillColor(34, 197, 94); // green
          }
          doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
          doc.setTextColor(255, 255, 255);
          doc.text(data.cell.text[0], data.cell.x + 7, data.cell.y + 5);
        }
      }
    });
    
    doc.save(`risks-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={exportToJSON}
        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
      >
        <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 16 16"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6 2.984V2h-.09c-.313 0-.616.062-.909.185a2.33 2.33 0 0 0-.775.53 2.23 2.23 0 0 0-.493.753v.001a3.542 3.542 0 0 0-.198.83v.002a6.08 6.08 0 0 0-.024.863c.012.29.018.58.018.869 0 .203-.04.393-.117.572v.001a1.504 1.504 0 0 1-.765.787 1.376 1.376 0 0 1-.558.115H2v.984h.09c.195 0 .38.04.556.121l.001.001c.178.078.329.184.455.318l.002.002c.13.13.233.285.307.465l.001.002c.078.18.117.368.117.566 0 .29-.006.58-.018.869-.012.296-.004.585.024.87v.001c.033.283.099.558.197.824v.001c.106.273.271.524.494.753.223.23.482.407.775.53.293.123.596.185.91.185H6v-.984h-.09c-.2 0-.387-.038-.563-.115a1.613 1.613 0 0 1-.457-.32 1.659 1.659 0 0 1-.309-.467c-.074-.18-.11-.37-.11-.573 0-.228.003-.453.011-.672.008-.228.008-.45 0-.665a4.639 4.639 0 0 0-.055-.64 2.682 2.682 0 0 0-.168-.609A2.284 2.284 0 0 0 3.522 8a2.284 2.284 0 0 0 .738-.955c.08-.192.135-.393.168-.602.033-.21.051-.423.055-.64.008-.22.008-.442 0-.666-.008-.224-.012-.45-.012-.678a1.47 1.47 0 0 1 .877-1.354 1.33 1.33 0 0 1 .563-.121H6zm4 10.032V14h.09c.313 0 .616-.062.909-.185.293-.123.552-.3.775-.53.223-.23.388-.48.493-.753v-.001c.1-.266.165-.543.198-.83v-.002c.028-.28.036-.567.024-.863-.012-.29-.018-.58-.018-.869 0-.203.04-.393.117-.572v-.001a1.502 1.502 0 0 1 .765-.787 1.38 1.38 0 0 1 .558-.115H14v-.984h-.09c-.196 0-.381-.04-.557-.121l-.001-.001a1.376 1.376 0 0 1-.455-.318l-.002-.002a1.415 1.415 0 0 1-.307-.465v-.002a1.405 1.405 0 0 1-.118-.566c0-.29.006-.58.018-.869a6.174 6.174 0 0 0-.024-.87v-.001a3.537 3.537 0 0 0-.197-.824v-.001a2.23 2.23 0 0 0-.494-.753 2.331 2.331 0 0 0-.775-.53 2.325 2.325 0 0 0-.91-.185H10v.984h.09c.2 0 .387.038.562.115.174.082.326.188.457.32.127.134.23.29.309.467.074.18.11.37.11.573 0 .228-.003.452-.011.672-.008.228-.008.45 0 .665.004.222.022.435.055.64.033.214.089.416.168.609a2.285 2.285 0 0 0 .738.955 2.285 2.285 0 0 0-.738.955 2.689 2.689 0 0 0-.168.602c-.033.21-.051.423-.055.64a9.15 9.15 0 0 0 0 .666c.008.224.012.45.012.678a1.471 1.471 0 0 1-.877 1.354 1.33 1.33 0 0 1-.563.121H10z" />
        </svg>
        Export JSON
      </button>
      <button
        onClick={exportToPDF}
        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
      >
        <svg
            className="w-5 h-5"
            viewBox="0 0 512 512"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M75.9466667,285.653333 C63.8764997,278.292415 49.6246897,275.351565 35.6266667,277.333333 L0,277.333333 L0,405.333333 
            L28.3733333,405.333333 L28.3733333,356.48 L40.5333333,356.48 C53.1304778,357.774244 65.7885986,354.68506 76.3733333,347.733333 
            C85.3576891,340.027178 90.3112817,328.626053 89.8133333,316.8 C90.4784904,304.790173 85.3164923,293.195531 75.9466667,285.653333 Z 
            M53.12,332.373333 C47.7608867,334.732281 41.8687051,335.616108 36.0533333,334.933333 L27.7333333,334.933333 L27.7333333,298.666667 
            L36.0533333,298.666667 C42.094796,298.02451 48.1897668,299.213772 53.5466667,302.08 C58.5355805,305.554646 61.3626692,311.370371 
            61.0133333,317.44 C61.6596233,323.558965 58.5400493,329.460862 53.12,332.373333 Z 
            M150.826667,277.333333 L115.413333,277.333333 L115.413333,405.333333 L149.333333,405.333333 
            C166.620091,407.02483 184.027709,403.691457 199.466667,395.733333 C216.454713,383.072462 225.530463,362.408923 223.36,341.333333 
            C224.631644,323.277677 218.198313,305.527884 205.653333,292.48 C190.157107,280.265923 170.395302,274.806436 
            150.826667,277.333333 Z 
            M178.986667,376.32 C170.098963,381.315719 159.922142,383.54422 149.76,382.72 L144.213333,382.72 L144.213333,299.946667 
            L149.333333,299.946667 C167.253333,299.946667 174.293333,301.653333 181.333333,308.053333 C189.877212,316.948755 
            194.28973,329.025119 193.493333,341.333333 C194.590843,354.653818 189.18793,367.684372 178.986667,376.32 Z 
            M254.506667,405.333333 L283.306667,405.333333 L283.306667,351.786667 L341.333333,351.786667 L341.333333,329.173333 
            L283.306667,329.173333 L283.306667,299.946667 L341.333333,299.946667 L341.333333,277.333333 L254.506667,277.333333 
            L254.506667,405.333333 Z 
            M234.666667,0 L0,0 L0,234.666667 L42.6666667,234.666667 L42.6666667,42.6666667 L216.96,42.6666667 
            L298.666667,124.373333 L298.666667,234.666667 L341.333333,234.666667 L341.333333,106.666667 L234.666667,0 Z"/>
        </svg>
        Export PDF
      </button>
    </div>
  );
};

export default ExportButtons;