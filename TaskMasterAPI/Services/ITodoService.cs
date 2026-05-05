using TaskMasterAPI.DTOs;

namespace TaskMasterAPI.Services
{
    public interface ITodoService
    {
        Task<IEnumerable<TodoResponseDto>> GetAllAsync(int userId);
        Task<TodoResponseDto> CreateAsync(int userId, CreateTodoDto dto);
        Task<bool> UpdateAsync(int userId, int id, UpdateTodoDto dto);
        Task<bool> DeleteAsync(int userId, int id);
    }
}