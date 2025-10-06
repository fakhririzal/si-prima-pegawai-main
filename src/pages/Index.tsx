import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-green-500 p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="flex justify-center gap-3 mb-6">
            <img src="/logo-puskesmas.jpg"
              alt="Logo SI PRIMA" 
              className="w-12 h-12 rounded-lg object-cover"
            />
          </div>
          <CardTitle className="text-3xl font-bold">SI PRIMA</CardTitle>
          <CardDescription className="text-lg">
            Sistem Arsip Data Kepegawaian
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Kelola data Kepegawaian dengan Mudah dan Terorganisir
          </p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => navigate("/auth")} size="lg" className="w-full">
              Masuk ke Sistem
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
