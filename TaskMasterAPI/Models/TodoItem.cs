namespace TaskMasterAPI.Models
{
    public enum Priority
    {
        Low,
        Medium,
        High
    }

    public class TodoItem
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime? DueDate { get; set; }  // make nullable — not every task needs a due date
        public Priority Priority { get; set; } = Priority.Medium;
        public string? Category { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int UserId { get; set; }
        public User? User { get; set; }
    }
}