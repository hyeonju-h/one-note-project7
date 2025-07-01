import React from 'react';
import { jsPDF } from 'jspdf';

function SavePDF({ content }) {
  const handleSave = () => {
    const pdf = new jsPDF();
    pdf.setFont('helvetica');
    pdf.text(content || '내용이 없습니다.', 10, 10);
    pdf.save('알림장.pdf');
  };

  return (
    <button onClick={handleSave}>PDF 저장하기</button>
  );
}

export default SavePDF;
