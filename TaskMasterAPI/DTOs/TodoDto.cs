using System.ComponentModel.DataAnnotations;
using TaskMasterAPI.Models;

namespace TaskMasterAPI.DTOs
{
    public class CreateTodoDto
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        public DateTime? DueDate { get; set; }
        public Priority Priority { get; set; } = Priority.Medium;

        [MaxLength(100)]
        public string? Category { get; set; }
    }

    public class UpdateTodoDto
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        public bool IsCompleted { get; set; }
        public DateTime? DueDate { get; set; }
        public Priority Priority { get; set; }

        [MaxLength(100)]
        public string? Category { get; set; }
    }

    public class TodoResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime? DueDate { get; set; }
        public Priority Priority { get; set; }
        public string? Category { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}