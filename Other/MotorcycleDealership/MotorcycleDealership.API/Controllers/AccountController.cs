using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

[Route("Account")]
public class AccountController : Controller
{
    private readonly SignInManager<IdentityUser> _signInManager;

    [HttpPost("Login")]
    [Produces("application/json")]
    public async Task<IActionResult> LoginApi([FromBody] LoginDto model)
    {
        var result = await _signInManager.PasswordSignInAsync(model.Username, model.Password, false, false);
        if (result.Succeeded)
            return Ok();

        return Unauthorized("Invalid username or password");
    }

    public class LoginDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

}