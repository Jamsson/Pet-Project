using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MotorcycleDealership.Application.Interfaces;
using MotorcycleDealership.Domain.Entities;
using System.Threading;
using Microsoft.Extensions.Logging;

namespace MotorcycleDealership.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IRepository<User> _userRepository;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IRepository<User> userRepository, ILogger<AuthController> logger)
        {
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

[HttpPost("register")]
public async Task<IActionResult> Register([FromBody] User user, CancellationToken cancellationToken)
{
    _logger.LogInformation("Register attempt for username: {Username}", user?.Username);

    if (!ModelState.IsValid)
    {
        _logger.LogWarning("ModelState invalid: {Errors}", string.Join("; ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)));
        return BadRequest(ModelState);
    }

    if (string.IsNullOrWhiteSpace(user?.Username) || string.IsNullOrWhiteSpace(user?.Password))
    {
        _logger.LogWarning("Username or password is missing.");
        return BadRequest(new { error = "Username and password are required." });
    }

    var users = await _userRepository.FindAsync(u => u.Username == user.Username, cancellationToken);
    var userList = await users.ToListAsync(cancellationToken);
    if (userList.Any())
    {
        _logger.LogWarning("Username {Username} already exists.", user.Username);
        return BadRequest(new { error = "Username already exists." });
    }

    if (string.IsNullOrEmpty(user.Id))
    {
        user.Id = Guid.NewGuid().ToString();
    }

    await _userRepository.AddAsync(user, cancellationToken);

    // Automatic login
    var loginModel = new LoginModel { Username = user.Username, Password = user.Password };
    var loginUsers = await _userRepository.FindAsync(u => u.Username == loginModel.Username && u.Password == loginModel.Password, cancellationToken);
    var loggedInUser = await loginUsers.FirstOrDefaultAsync(cancellationToken);

    if (loggedInUser != null)
    {
        if (loggedInUser.Id != null)
        {
            HttpContext.Session.SetString("UserId", loggedInUser.Id);
            _logger.LogInformation("Session set for UserId: {UserId}", loggedInUser.Id);
        }
        if (loggedInUser.Username != null)
        {
            HttpContext.Session.SetString("Username", loggedInUser.Username);
            _logger.LogInformation("Session set for Username: {Username}", loggedInUser.Username);
        }
        return Ok(new { message = "Registration and login successful", userId = loggedInUser.Id });
    }

    _logger.LogWarning("Automatic login failed for username: {Username}", user.Username);
    return Ok(new { message = "Registration successful" });
}

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel login, CancellationToken cancellationToken)
        {
            var users = await _userRepository.FindAsync(u => u.Username == login.Username && u.Password == login.Password, cancellationToken);
            var user = await users.FirstOrDefaultAsync(cancellationToken);

            if (user == null)
                return Unauthorized(new { error = "Invalid credentials." });

            if (user.Id != null)
            {
                HttpContext.Session.SetString("UserId", user.Id);
            }
            else
            {
                return BadRequest(new { error = "User ID is null, cannot set session." });
            }

            if (user.Username != null)
            {
                HttpContext.Session.SetString("Username", user.Username);
            }
            else
            {
                return BadRequest(new { error = "Username is null, cannot set session." });
            }

            return Ok(new { message = "Logged in successfully", userId = user.Id });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return Ok("Logged out successfully");
        }
    }

    public class LoginModel
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}