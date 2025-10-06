import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Download } from "lucide-react";
import { toast } from "sonner";

interface Employee {
  id: string;
  nama: string;
  nip: string;
  jabatan: string;
  pangkat_golongan: string;
  pendidikan_terakhir: string;
}

const Laporan = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from("employees")
        .select("id, nama, nip, jabatan, pangkat_golongan, pendidikan_terakhir")
        .order("nama");

      if (error) throw error;
      setEmployees(data || []);
    } catch (error: any) {
      toast.error("Gagal memuat data pegawai");
    } finally {
      setLoading(false);
    }
  };

  const generateReport = () => {
    if (employees.length === 0) {
      toast.error("Tidak ada data untuk diekspor");
      return;
    }

    const csvContent = [
      ["No", "Nama", "NIP", "Jabatan", "Pangkat/Golongan", "Pendidikan Terakhir"],
      ...employees.map((emp, index) => [
        (index + 1).toString(),
        emp.nama,
        emp.nip,
        emp.jabatan,
        emp.pangkat_golongan,
        emp.pendidikan_terakhir,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `laporan-pegawai-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Laporan berhasil diunduh");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Laporan</CardTitle>
            <CardDescription>
              Belum ada data pegawai yang dapat dilaporkan
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center mb-4">
              Silakan tambahkan data pegawai terlebih dahulu untuk membuat laporan
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Laporan</h1>
          <p className="text-muted-foreground mt-1">
            Laporan data kepegawaian ({employees.length} pegawai)
          </p>
        </div>
        <Button onClick={generateReport}>
          <Download className="h-4 w-4 mr-2" />
          Export ke CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pegawai</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">No.</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>NIP</TableHead>
                <TableHead>Jabatan</TableHead>
                <TableHead>Pangkat/Golongan</TableHead>
                <TableHead>Pendidikan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee, index) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{employee.nama}</TableCell>
                  <TableCell>{employee.nip}</TableCell>
                  <TableCell>{employee.jabatan}</TableCell>
                  <TableCell>{employee.pangkat_golongan}</TableCell>
                  <TableCell>{employee.pendidikan_terakhir}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Laporan;
