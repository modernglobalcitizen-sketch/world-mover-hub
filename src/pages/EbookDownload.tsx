import { Download, BookOpen, Home, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ebookCover from "@/assets/ebook-cover.png";

const EBOOK_URL = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/ebooks/Your_International_Guide_to_Work_Volunteer_and_Travel.pdf`;

const EbookDownload = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow flex items-center justify-center py-16">
        <div className="container mx-auto px-4 max-w-xl text-center">
          <Card className="border-2 border-primary/20">
            <CardContent className="pt-10 pb-8 space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mx-auto">
                <BookOpen className="h-10 w-10 text-primary" />
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl font-bold text-foreground">
                  Thank You for Your Purchase!
                </h1>
                <p className="text-lg text-muted-foreground">
                  Your ebook is ready to download.
                </p>
              </div>

              <img
                src={ebookCover}
                alt="Your International Guide to Work, Volunteer, and Travel"
                className="w-48 mx-auto rounded-lg shadow-md"
              />

              <Button
                size="lg"
                className="w-full text-lg gap-2"
                onClick={() => window.open(EBOOK_URL, "_blank")}
              >
                <Download className="w-5 h-5" />
                Download Your Ebook
              </Button>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button asChild variant="outline">
                  <Link to="/ebooks">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Ebook
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <p className="text-sm text-muted-foreground mt-8 italic">
            "From the diaspora, for the diaspora — enjoy the journey."
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EbookDownload;
