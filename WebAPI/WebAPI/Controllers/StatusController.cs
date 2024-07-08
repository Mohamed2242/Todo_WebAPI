using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToDoListProject.Data;
using ToDoListProject.Models;

namespace WebAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class StatusController : ControllerBase
	{
		private readonly ApplicationDbContext _context;

		public StatusController(ApplicationDbContext context)
		{
			_context = context;
		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<Status>>> GetStatuses()
		{
			return await _context.Statuses.ToListAsync();
		}
	}
}
