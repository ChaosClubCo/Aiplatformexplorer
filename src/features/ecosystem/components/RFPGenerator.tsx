import React, { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { ecosystemService } from '../../../services/ecosystemService';
import { RFPProject } from '../../../types/ecosystem';
import { FileText, Download, Send } from 'lucide-react';
import { toast } from 'sonner';

export function RFPGenerator() {
  const [rfp, setRfp] = useState<RFPProject | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await ecosystemService.generateRFP(['p1', 'p2'], 'req_1');
    setRfp(result);
    setLoading(false);
    toast.success('Draft RFP Generated');
  };

  if (!rfp) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-xl">
        <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium">No RFP Drafted</h3>
        <p className="text-gray-500 mb-6">Select platforms to generate a Request for Proposal based on your requirements.</p>
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? 'Generating...' : 'Draft New RFP'}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-6 h-[600px]">
      <div className="col-span-1 border-r pr-6 space-y-4">
        <div>
          <h3 className="font-bold text-lg mb-1">{rfp.title}</h3>
          <p className="text-xs text-gray-500">Generated {new Date(rfp.generatedAt).toLocaleDateString()}</p>
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-400">Sections</label>
          {rfp.sections.map(s => (
            <div key={s.id} className="p-3 bg-white border rounded-lg text-sm font-medium hover:border-primary cursor-pointer">
              {s.title}
            </div>
          ))}
        </div>

        <div className="pt-4 border-t space-y-2">
           <Button className="w-full" variant="outline">
             <Download className="w-4 h-4 mr-2" /> Export PDF
           </Button>
           <Button className="w-full">
             <Send className="w-4 h-4 mr-2" /> Send to Vendors
           </Button>
        </div>
      </div>

      <div className="col-span-2 bg-gray-50 p-8 rounded-lg overflow-y-auto font-serif">
        <div className="bg-white shadow-sm p-12 min-h-[800px] max-w-[800px] mx-auto">
          <div className="text-center border-b pb-8 mb-8">
            <h1 className="text-3xl font-bold mb-2">{rfp.title}</h1>
            <p className="text-gray-500">Prepared for INT Inc.</p>
          </div>

          {rfp.sections.map(s => (
            <div key={s.id} className="mb-8">
              <h2 className="text-xl font-bold mb-4">{s.title}</h2>
              <p className="leading-relaxed text-gray-700">{s.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
