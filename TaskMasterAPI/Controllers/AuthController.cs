using Microsoft.AspNetCore.Mvc;
using TaskMasterAPI.DTOs;
using TaskMasterAPI.Services;

namespace TaskMasterAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var (success, message) = await _authService.RegisterAsync(dto);

            return success
                ? Ok(new { message })
                : BadRequest(new { message });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var (success, response) = await _authService.LoginAsync(dto);

            return success
                ? Ok(response)
                : Unauthorized(new { message = "Invalid username or password." });
        }
    }
}