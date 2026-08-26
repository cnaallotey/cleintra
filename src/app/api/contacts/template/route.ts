import { NextResponse } from "next/server";

export async function GET() {
  const sampleCsvContent = `Name,Phone,Email,Source,Notes
Kwame Mensah,0241234567,kwame@example.com,Facebook Ad,Interested in wholesale pricing
Ama Osei,+233501234567,ama.osei@gmail.com,Referral,Follow up next Tuesday
Kofi Boateng,0559876543,,Walk-in,Requested catalog
Abena Antwi,,abena@business.com,Website,Inquired about delivery options
`;

  return new NextResponse(sampleCsvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="sample-contacts.csv"',
    },
  });
}
