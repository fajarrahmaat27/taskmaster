using TaskMasterAPI.DTOs;

namespace TaskMasterAPI.Services
{
    public interface IAuthService
    {
        Task<(bool Success, string Message)> RegisterAsync(RegisterDto dto);
        Task<(bool Success, AuthResponseDto? Response)> LoginAsync(LoginDto dto);
    }
}