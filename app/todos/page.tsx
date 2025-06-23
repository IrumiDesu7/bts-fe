'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getAllChecklists, createChecklist, deleteChecklist } from '@/lib/api/checklist'
import { getChecklistItems } from '@/lib/api/checklist-items'
import type { Checklist } from '@/types/checklist'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function TodosPage() {
  const { token, user } = useAuth()
  const router = useRouter()
  const [todos, setTodos] = useState<Checklist[]>([])
  const [todoProgress, setTodoProgress] = useState<Record<number, { completed: number; total: number }>>({})
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newTodoName, setNewTodoName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const fetchTodos = useCallback(async () => {
    if (!token) return
    
    try {
      setLoading(true)
      const data = await getAllChecklists(token)
      setTodos(data)
      
      // Fetch progress for each checklist
      const progressData: Record<number, { completed: number; total: number }> = {}
      await Promise.all(
        data.map(async (checklist) => {
          try {
            const items = await getChecklistItems(checklist.id, token)
            progressData[checklist.id] = {
              completed: items.filter(item => item.completed).length,
              total: items.length
            }
          } catch (error) {
            console.error(`Error fetching items for checklist ${checklist.id}:`, error)
            progressData[checklist.id] = { completed: 0, total: 0 }
          }
        })
      )
      setTodoProgress(progressData)
    } catch (error) {
      toast.error('Failed to fetch todos')
      console.error('Error fetching todos:', error)
    } finally {
      setLoading(false)
    }
  }, [token])

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !newTodoName.trim()) return

    try {
      setIsCreating(true)
      const newTodo = await createChecklist({ name: newTodoName.trim() }, token)
      setTodos(prev => [...prev, newTodo])
      setNewTodoName('')
      setIsCreateDialogOpen(false)
      toast.success('Todo created successfully')
    } catch (error) {
      toast.error('Failed to create todo')
      console.error('Error creating todo:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteTodo = async (id: number) => {
    if (!token) return

    try {
      await deleteChecklist(id, token)
      setTodos(prev => prev.filter(todo => todo.id !== id))
      toast.success('Todo deleted successfully')
    } catch (error) {
      toast.error('Failed to delete todo')
      console.error('Error deleting todo:', error)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Please log in to view your todos.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">My Todos</h1>
            <p className="text-muted-foreground">Welcome back, {user.username}!</p>
          </div>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Todo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Todo</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTodo} className="space-y-4">
              <div>
                <Label htmlFor="todoName">Todo Name</Label>
                <Input
                  id="todoName"
                  value={newTodoName}
                  onChange={(e) => setNewTodoName(e.target.value)}
                  placeholder="Enter todo name..."
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? 'Creating...' : 'Create Todo'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : todos.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">No todos yet</h3>
              <p className="text-muted-foreground mb-4">Create your first todo to get started!</p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Todo
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {todos.map((todo) => {
            const progress = todoProgress[todo.id] || { completed: 0, total: 0 }
            const progressPercentage = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0
            
            return (
              <Card 
                key={todo.id} 
                className="relative group cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push(`/todos/${todo.id}`)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {todo.name}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteTodo(todo.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {progress.completed} of {progress.total} completed
                      </span>
                      <span className="text-muted-foreground">
                        {Math.round(progressPercentage)}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                    {todo.createdAt && (
                      <p className="text-sm text-muted-foreground">
                        Created: {new Date(todo.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}