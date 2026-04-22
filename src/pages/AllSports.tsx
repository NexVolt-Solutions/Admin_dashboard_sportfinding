import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SportCard from "@/components/cards/SportCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const sportsData = [
  { name: "Basketball", level: "Intermediate" },
  { name: "Football", level: "Advanced" },
  { name: "Tennis", level: "Beginner" },
  { name: "Cricket", level: "Beginner" },
  { name: "Badminton", level: "Beginner" },
  { name: "Tennis", level: "Beginner" },
];

export default function AllSports() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            All Sports
          </h1>
          <p className="text-sm text-muted-foreground">
            {sportsData.length} total sport{sportsData.length === 1 ? "" : "s"}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </header>

      <Card>
        <CardContent className="space-y-6 p-6 sm:p-8">
          <h3 className="font-heading text-base font-semibold text-foreground">
            My Sports
          </h3>
          <div className="flex flex-col gap-3">
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
