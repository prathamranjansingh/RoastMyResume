import { useState, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [file, setFile] = useState(null);
  const [roastLevel, setRoastLevel] = useState("1");
  const [showPopup, setShowPopup] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef(null);

  const handleFileChange = (event) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please upload a resume first!");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("mode", roastLevel);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/roast`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFeedback(response.data.feedback);
      setShowPopup(true);
    } catch (error) {
      console.error("Error roasting resume:", error);
      alert("An error occurred while roasting your resume.");
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between">
        <Link className="flex items-center justify-center" to="#">
          <Zap className="h-6 w-6 text-black" />
          <span className="sr-only">Resume Roast</span>
        </Link>
        <span className='text-center font-bold'>RoastMyResume</span>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 bg-pattern md:py-24 lg:py-24 xl:pb-24 xl:pt-34">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-14">
                <h1 className="text-4xl tracking-wide sm:text-5xl md:text-6xl text-white font-extrabold">
                  🎤 Roast Your Resume
                </h1>
                <div className='py-4 bg-black rounded-2xl'>
                  <h1 className='text-2xl font-extrabold tracking-wide sm:text-3xl md:text-4xl text-white'> Turning Tragedy into Comedy...</h1>
                </div>
                <p className="mx-auto max-w-[700px] text-white font-extrabold md:text-xl tracking-wide">
                  🌶️ Ready to Face the Music? Is your resume a disaster that makes you cringe harder than your last family photo? Upload it here, and let's turn that sad document into a comedy roast that even your future boss will remember!
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Button className="w-full rounded-full font-extrabold text-black bg-white hover:bg-gray-200" size="lg" onClick={scrollToForm}>
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32" ref={formRef}>
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-2 text-center gap-10">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-wide sm:text-4xl md:text-5xl">
                  🎉 Ready to Get Roasted?
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl tracking-wide">
                  Don't let your resume gather dust! Get hilarious, personalized feedback that will make you the star of the job fair!
                </p>
              </div>
              <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <label htmlFor="resume-upload" className="block text-sm font-medium text-gray-700 p-1 mb-2">
                      👉 Upload Your Resume NOW, if You Dare!
                    </label>
                    <input
                      id="resume-upload"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black-50 file:text-black-700 hover:file:bg-black-100"
                    />
                  </CardContent>
                </Card>
                <Select value={roastLevel} onValueChange={setRoastLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Roast Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Gentle Jab</SelectItem>
                    <SelectItem value="2">Sassy Roast</SelectItem>
                    <SelectItem value="3">Brutal Burn</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit" className="w-full font-bold text-white hover:bg-black-700" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Roasting...
                    </>
                  ) : (
                    'Roast My Resume! 🔥'
                  )}
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-3xl mx-auto my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">🔥 Your Roast Results:</h3>
              <Button variant="ghost" onClick={() => setShowPopup(false)}>
                ✕
              </Button>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Preparing your roast...</span>
              </div>
            ) : (
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown>{feedback}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
