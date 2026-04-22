import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, MessageCircle, UserPlus } from "lucide-react";

interface ProfileCardProps {
  name: string;
  location: string;
  avatar: string;
}

const ProfileCard = ({ name, location, avatar }: ProfileCardProps) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center p-8 text-center">
        <div className="mb-5 h-28 w-28 overflow-hidden rounded-full ring-1 ring-border">
          <img
            src={avatar}
            alt={name}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
          {name}
        </h2>
        <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span>{location}</span>
        </div>

        <div className="mt-6 flex w-full gap-2">
          <Button type="button" className="flex-1">
            <MessageCircle className="h-4 w-4" />
            Message
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Add contact"
          >
            <UserPlus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(ProfileCard);
