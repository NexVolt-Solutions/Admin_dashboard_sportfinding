import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, MessageCircle, UserPlus, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileCardProps {
  name: string;
  location: string;
  avatar: string;
}

const ProfileCard = ({ name, location, avatar }: ProfileCardProps) => {
  return (
    <Card className="border-none shadow-none rounded-[32px] overflow-hidden bg-white">
      <CardContent className="p-10 flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="h-[140px] w-[140px] rounded-full overflow-hidden border-4 border-white shadow-sm ring-1 ring-slate-100">
            <img 
              src={avatar} 
              alt={name}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer" 
            />
          </div>
          <div className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md border border-slate-50">
            <Trophy className="w-5 h-5 text-slate-400" />
          </div>
        </div>
        
        <h2 className="text-[28px] font-sans font-bold text-[#0F172A] mb-2">{name}</h2>
        <div className="flex items-center gap-1.5 text-slate-400 font-sans font-medium text-[15px] mb-8">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>

        <div className="flex gap-4 w-full">
          <Button className="flex-1 bg-[#60A5FA] hover:bg-blue-500 text-white rounded-2xl h-[52px] font-sans font-bold text-[15px] shadow-lg shadow-blue-100 border-none">
            Message
          </Button>
          <Button variant="outline" className="w-[52px] h-[52px] p-0 border-none bg-[#E0F2FE] rounded-2xl hover:bg-blue-100 group transition-colors">
            <UserPlus className="w-6 h-6 text-[#60A5FA] group-hover:text-blue-500" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(ProfileCard);
