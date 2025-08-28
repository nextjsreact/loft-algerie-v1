import { ModernTasksPage } from "@/components/tasks/modern-tasks-page"

// Mock data for demonstration
const mockTasks = [
  {
    id: "1",
    title: "Révision du système de réservation",
    description: "Analyser et améliorer le processus de réservation pour optimiser l'expérience utilisateur",
    status: "in_progress" as const,
    due_date: "2024-12-20",
    assigned_to: "user1",
    created_at: "2024-12-10T10:00:00Z",
    updated_at: "2024-12-15T14:30:00Z"
  },
  {
    id: "2", 
    title: "Maintenance climatisation Loft Paris",
    description: "Vérification et entretien du système de climatisation du loft parisien",
    status: "todo" as const,
    due_date: "2024-12-18",
    assigned_to: "user2",
    created_at: "2024-12-12T09:00:00Z",
    updated_at: "2024-12-12T09:00:00Z"
  },
  {
    id: "3",
    title: "Rapport financier mensuel",
    description: "Compilation et analyse des données financières du mois de novembre",
    status: "completed" as const,
    due_date: "2024-12-15",
    assigned_to: "user1",
    created_at: "2024-12-01T08:00:00Z",
    updated_at: "2024-12-14T16:45:00Z"
  },
  {
    id: "4",
    title: "Formation équipe support client",
    description: "Organiser une session de formation pour l'équipe du support client sur les nouveaux outils",
    status: "todo" as const,
    due_date: "2024-12-25",
    assigned_to: "user3",
    created_at: "2024-12-13T11:00:00Z",
    updated_at: "2024-12-13T11:00:00Z"
  },
  {
    id: "5",
    title: "Mise à jour documentation API",
    description: "Mettre à jour la documentation de l'API avec les dernières modifications",
    status: "in_progress" as const,
    due_date: "2024-12-16",
    assigned_to: "user1",
    created_at: "2024-12-08T14:00:00Z",
    updated_at: "2024-12-15T10:20:00Z"
  },
  {
    id: "6",
    title: "Audit sécurité système",
    description: "Effectuer un audit complet de sécurité sur tous les systèmes critiques",
    status: "todo" as const,
    due_date: "2024-12-14", // Tâche en retard
    assigned_to: "user2",
    created_at: "2024-12-05T13:00:00Z",
    updated_at: "2024-12-05T13:00:00Z"
  }
]

const mockUsers = [
  { id: "user1", full_name: "Habib Admin", email: "habib@example.com" },
  { id: "user2", full_name: "Sarah Manager", email: "sarah@example.com" },
  { id: "user3", full_name: "Ahmed Developer", email: "ahmed@example.com" },
  { id: "user4", full_name: "Fatima Designer", email: "fatima@example.com" }
]

export default function TasksDemoPage() {
  return (
    <ModernTasksPage
      tasks={mockTasks}
      users={mockUsers}
      userRole="admin"
      currentUserId="user1"
    />
  )
}