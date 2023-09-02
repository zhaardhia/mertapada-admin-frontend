
export const objCategory = [
  {
    id: "shop-001",
    name: "lauk - pauk"
  },
  {
    id: "shop-002",
    name: "bumbu - sayuran"
  },
  {
    id: "shop-003",
    name: "sembako - minuman"
  },
  {
    id: "shop-004",
    name: "lain - lain"
  }
]

// Define the type for your option
export type CustomOptionType = {
  value: string;
  label: string;
};

export const unitTypes: CustomOptionType[] = [
  { value: 'kg', label: 'kg' },
  { value: 'liter', label: 'liter' },
  { value: 'pack', label: 'pack' },
  { value: 'paket', label: 'paket' },
  { value: 'tabung', label: 'tabung' },
  { value: 'galon', label: 'galon' },
  { value: 'botol', label: 'botol' },
  { value: 'lainnya', label: 'Lainnya' }
]

export function formatRupiah(number: number | undefined) {
  if (number) return 'Rp ' + number.toLocaleString('id-ID');
  return 'Rp ' + 0
}

export function findCategoryShopExpense(categoryName: string | undefined) {
  if (categoryName !== undefined) {
    switch (categoryName) {
      case 'lauk - pauk':
        return 'shop-001';
      case 'bumbu - sayuran':
        return 'shop-002';
      case 'sembako - minuman':
        return 'shop-003';
      case 'lain - lain':
        return 'shop-004';
      default:
        return 'shop-000';
    }
  }
  else return "check the system."
}

// export const createPDF = async (pdfContainerRef: HTMLDivElement) => {   
//   const pdf = new jsPDF("portrait", "pt", "a4"); 
//   const data = await html2canvas(pdfContainerRef);
//   const img = data.toDataURL("image/png");  
//   // const imgProperties = pdf.getImageProperties(img);
//   // const pdfWidth = pdf.internal.pageSize.getWidth();
//   // const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
//   // pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
//   // pdf.save("shipping_label.pdf");
//       pdf.addImage(img, 'PNG', 10, 10, 290, 680);
//       pdf.save('exported-document.pdf');
// };