'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Plus, Trash2, Edit2, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { Checklist, ChecklistItem } from '@/types/checklist'
import { getAllChecklists } from '@/lib/api/checklist'
import { 
  getChecklistItems, 
  createChecklistItem, 
  updateChecklistItemStatus, 
  deleteChecklistItem, 
  renameChecklistItem 
} from '@/lib/api/checklist-items'

export default function TodoDetailPage() {
  const { token, user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const checklistId = parseInt(params.id as string)

  const [checklist, setChecklist] = useState<Checklist | null>(null)
  const [items, setItems] = useState<ChecklistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [newItemName, setNewItemName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [editingItemId, setEditingItemId] = useState<number | null>(null)
  const [editingItemName, setEditingItemName] = useState('')

  const fetchChecklist = useCallback(async () => {
    if (!token) return
    
    try {
      const checklists = await getAllChecklists(token)
      const currentChecklist = checklists.find(c => c.id === checklistId)
      if (!currentChecklist) {
        toast.error('Checklist not found')
        router.push('/todos')
        return
      }
      setChecklist(currentChecklist)
    } catch (error) {
      toast.error('Failed to fetch checklist')
      console.error('Error fetching checklist:', error)
    }
  }, [token, checklistId, router])

  const fetchItems = useCallback(async () => {
    if (!token) return
    
    try {
      const data = await getChecklistItems(checklistId, token)
      setItems(data)
    } catch (error) {
      toast.error('Failed to fetch items')
      console.error('Error fetching items:', error)
    } finally {
      setLoading(false)
    }
  }, [token, checklistId])

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !newItemName.trim()) return

    try {
      setIsCreating(true)
      const newItem = await createChecklistItem(checklistId, newItemName.trim(), token)
      setItems(prev => [...prev, newItem])
      setNewItemName('')
      toast.success('Item added successfully')
    } catch (error) {
      toast.error('Failed to add item')
      console.error('Error creating item:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleToggleItem = async (itemId: number) => {
    if (!token) return

    try {
      const updatedItem = await updateChecklistItemStatus(checklistId, itemId, token)
      setItems(prev => prev.map(item => 
        item.id === itemId ? updatedItem : item
      ))
    } catch (error) {
      toast.error('Failed to update item')
      console.error('Error updating item:', error)
    }
  }

  const handleDeleteItem = async (itemId: number) => {
    if (!token) return

    try {
      await deleteChecklistItem(checklistId, itemId, token)
      setItems(prev => prev.filter(item => item.id !== itemId))
      toast.success('Item deleted successfully')
    } catch (error) {
      toast.error('Failed to delete item')
      console.error('Error deleting item:', error)
    }
  }

  const handleStartEdit = (item: ChecklistItem) => {
    setEditingItemId(item.id)
    setEditingItemName(item.name)
  }

  const handleCancelEdit = () => {
    setEditingItemId(null)
    setEditingItemName('')
  }

  const handleSaveEdit = async (itemId: number) => {
    if (!token || !editingItemName.trim()) return

    try {
      const updatedItem = await renameChecklistItem(checklistId, itemId, editingItemName.trim(), token)
      setItems(prev => prev.map(item => 
        item.id === itemId ? updatedItem : item
      ))
      setEditingItemId(null)
      setEditingItemName('')
      toast.success('Item renamed successfully')
    } catch (error) {
      toast.error('Failed to rename item')
      console.error('Error renaming item:', error)
    }
  }

  useEffect(() => {
    if (checklistId) {
      fetchChecklist()
      fetchItems()
    }
  }, [fetchChecklist, fetchItems, checklistId])

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

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!checklist) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Checklist not found.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const completedCount = items.filter(item => item.itemCompletionStatus).length
  const totalCount = items.length

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/todos')}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{checklist.name}</h1>
          <p className="text-sm text-muted-foreground">
            {completedCount} of {totalCount} completed
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add New Item</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateItem} className="flex gap-2">
              <Input
                placeholder="Enter new item..."
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                disabled={isCreating}
                className="flex-1"
              />
              <Button type="submit" disabled={isCreating || !newItemName.trim()}>
                {isCreating ? (
                  <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Plus className="size-4" />
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-2">
          {items.map((item) => (
            <Card key={item.id} className="transition-all hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={item.itemCompletionStatus}
                    onCheckedChange={() => handleToggleItem(item.id)}
                  />
                  
                  {editingItemId === item.id ? (
                    <div className="flex-1 flex gap-2">
                      <Input
                        value={editingItemName}
                        onChange={(e) => setEditingItemName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveEdit(item.id)
                          } else if (e.key === 'Escape') {
                            handleCancelEdit()
                          }
                        }}
                        className="flex-1"
                        autoFocus
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleSaveEdit(item.id)}
                        disabled={!editingItemName.trim()}
                      >
                        <Check className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleCancelEdit}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span 
                        className={`flex-1 ${item.itemCompletionStatus ? 'line-through text-muted-foreground' : ''}`}
                      >
                        {item.name}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleStartEdit(item)}
                      >
                        <Edit2 className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {items.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No items yet. Add your first item above!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}