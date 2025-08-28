"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ModernDashboard() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Temporaire</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Le dashboard est en cours de correction. L'application fonctionne normalement.</p>
          <p>Vous pouvez accéder aux rapports PDF via le menu ou directement sur /reports</p>
        </CardContent>
      </Card>
    </div>
  );
}