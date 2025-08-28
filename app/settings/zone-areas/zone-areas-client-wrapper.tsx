"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ZoneAreaList } from "@/components/zone-areas/zone-areas-list";
import { ZoneAreaForm } from "@/components/forms/zone-area-form";
import { getZoneAreas, ZoneArea } from "@/app/actions/zone-areas";
import { toast } from "@/components/ui/use-toast";
import { MapPin, Plus, Edit } from "lucide-react";

type Translations = {
  pageTitle: string;
  subtitle: string;
  addNew: string;
  updateZoneArea: string;
  createZoneArea: string;
  updateZoneAreaInfo: string;
  createNewZoneArea: string;
  existingZoneAreas: string;
  totalZoneAreas: string;
  noZoneAreasFound: string;
  addFirstZoneArea: string;
  success: string;
  error: string;
  updateSuccess: string;
  createSuccess: string;
  refreshError: string;
};

interface ZoneAreasClientWrapperProps {
  initialZoneAreas: ZoneArea[];
  translations: Translations;
}

export default function ZoneAreasClientWrapper({ initialZoneAreas, translations: tStrings }: ZoneAreasClientWrapperProps) {
  const [editingZoneArea, setEditingZoneArea] = useState<ZoneArea | undefined>(undefined);
  const [zoneAreas, setZoneAreas] = useState<ZoneArea[]>(initialZoneAreas);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (zoneArea: ZoneArea) => {
    setEditingZoneArea(zoneArea);
    setShowForm(true);
  };

  const handleFormSuccess = async () => {
    setEditingZoneArea(undefined);
    setShowForm(false);
    // Re-fetch zone areas to update the list
    try {
      const updatedZoneAreas = await getZoneAreas();
      setZoneAreas(updatedZoneAreas);
      toast({
        title: "✅ " + tStrings.success,
        description: editingZoneArea
          ? tStrings.updateSuccess
          : tStrings.createSuccess,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "❌ " + tStrings.error,
        description: tStrings.refreshError,
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setEditingZoneArea(undefined);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            {tStrings.pageTitle}
          </h1>
          <p className="text-muted-foreground text-lg">{tStrings.subtitle}</p>
        </div>
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="mr-2 h-4 w-4" />
            {tStrings.addNew}
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                {editingZoneArea ? <Edit className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
              </div>
              {editingZoneArea ? tStrings.updateZoneArea : tStrings.createZoneArea}
            </CardTitle>
            <CardDescription className="text-base">
              {editingZoneArea
                ? tStrings.updateZoneAreaInfo
                : tStrings.createNewZoneArea}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ZoneAreaForm
              zoneArea={editingZoneArea}
              onSuccess={handleFormSuccess}
              onCancel={handleCancel}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {tStrings.existingZoneAreas}
          </CardTitle>
          <CardDescription>
            {tStrings.totalZoneAreas.replace('{count}', zoneAreas.length.toString())}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {zoneAreas.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg mb-2">
                {tStrings.noZoneAreasFound}
              </p>
              <p className="text-muted-foreground text-sm mb-4">
                {tStrings.addFirstZoneArea}
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {tStrings.addNew}
              </Button>
            </div>
          ) : (
            <ZoneAreaList
              zoneAreas={zoneAreas}
              onEdit={handleEdit}
              onRefresh={handleFormSuccess}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
