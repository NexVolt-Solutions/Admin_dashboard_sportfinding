import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SportCard from "@/components/cards/SportCard";
import { Card, CardContent } from "@/components/ui/card";

const sportsData = [
  { name: "Basketball", level: "Intermediate" },
  { name: "Football", level: "Advanced" },
  { name: "Tennis", level: "Beginner" },
  { name: "Cricket", level: "Beginner" },
  { name: "Bedminton", level: "Beginner" },
  { name: "Tennis", level: "Beginner" },
];

export default function AllSports() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[32px] font-sans font-bold text-[#0F172A] leading-tight">All Sports</h1>
          <p className="text-[16px] text-slate-400 font-sans font-medium mt-1">7 total sports</p>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors font-sans font-medium text-[16px] mt-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </div>

      <Card className="border-none shadow-none rounded-[40px] overflow-hidden bg-white">
        <CardContent className="p-12">
          <h3 className="text-[22px] font-sans font-bold text-[#0F172A] mb-10">My Sports</h3>
          <div className="flex flex-col gap-4">
            {sportsData.map((sport, index) => (
              <SportCard 
                key={`${sport.name}-${index}`} 
                name={sport.name} 
                level={sport.level} 
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
