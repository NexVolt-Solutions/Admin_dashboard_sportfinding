import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface ReviewCardProps {
  author: string;
  rating: number;
  date: string;
  content: string;
  key?: React.Key;
}

const ReviewCard = ({ author, rating, date, content }: ReviewCardProps) => {
  return (
    <Card className="border-none shadow-none rounded-2xl bg-[#E0F2FE]/40">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12 border-none">
            <AvatarFallback className="bg-[#E0F2FE] text-[#60A5FA] font-sans font-bold text-sm">
              {author[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h4 className="font-sans font-bold text-[#0F172A] text-[15px]">{author}</h4>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3.5 h-3.5 ${i < rating ? "text-slate-500 fill-slate-500" : "text-slate-300"}`} 
                  />
                ))}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 font-sans font-medium mb-3">{date}</p>
            <p className="text-[14px] text-slate-500 font-sans leading-relaxed">
              {content}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(ReviewCard);
