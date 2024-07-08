using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToDoListProject.Data;
using ToDoListProject.Models;

namespace WebAPI.Controllers
{
	[Route("[controller]")]
	[ApiController]
	public class HomeController : ControllerBase
	{

		private readonly ApplicationDbContext _context;

		public HomeController(ApplicationDbContext context)
		{
			_context = context;
		}

		// GET: Home
		[HttpGet]
		public async Task<ActionResult<IEnumerable<ToDo>>> GetAll()
		{
			return await _context.ToDos
				.Include(t => t.Category)
				.Include(t => t.Status)
				.ToListAsync();
		}

		// GET: api/todo/5
		[HttpGet("{id}")]
		public async Task<ActionResult<ToDo>> GetById(int id)
		{
			var todo = await _context.ToDos
				.Include(t => t.Category)
				.Include(t => t.Status)
				.FirstOrDefaultAsync(t => t.Id == id);

			if (todo == null)
			{
				return NotFound();
			}

			return todo;
		}

		// POST: api/ToDo/Add
		[HttpPost("Add")]
		public async Task<ActionResult<ToDo>> Add(ToDo toDo)
		{
			if (ModelState.IsValid)
			{
				_context.ToDos.Add(toDo);
				await _context.SaveChangesAsync();

				return CreatedAtAction(nameof(GetById), new { id = toDo.Id }, toDo);
			}
			return BadRequest(ModelState);
		}

		// PUT: api/ToDo/Edit/5
		[HttpPut("Edit/{id}")]
		public async Task<IActionResult> Edit(int id, ToDo toDo)
		{
			if (id != toDo.Id)
			{
				return BadRequest();
			}

			_context.Entry(toDo).State = EntityState.Modified;

			try
			{
				await _context.SaveChangesAsync();
			}
			catch (DbUpdateConcurrencyException)
			{
				if (!ToDoExists(id))
				{
					return NotFound();
				}
				else
				{
					throw;
				}
			}

			return NoContent();
		}

		// GET: api/ToDo/Filter
		[HttpGet("Filter/filterString={filterString}")]
		public async Task<ActionResult<IEnumerable<ToDo>>> Filter(string filterString)
		{
			var filters = new Filters(filterString);

			IQueryable<ToDo> query = _context.ToDos
				.Include(t => t.Category)
				.Include(t => t.Status);

			if (filters.HasCategory)
			{
				query = query.Where(t => t.CategoryId == filters.CategoryId);
			}

			if (filters.HasStatus)
			{
				query = query.Where(t => t.StatusId == filters.StatusId);
			}

			if (filters.HasDue)
			{
				var today = DateTime.Today;
				if (filters.IsPast)
				{
					query = query.Where(t => t.DueDate < today);
				}
				else if (filters.IsFuture)
				{
					query = query.Where(t => t.DueDate > today);
				}
				else if (filters.IsToday)
				{
					query = query.Where(t => t.DueDate == today);
				}
			}

			return await query.OrderBy(t => t.DueDate).ToListAsync();
		}

		// POST: api/ToDo/MarkComplete/5
		[HttpPost("MarkComplete/{id}")]
		public async Task<IActionResult> MarkComplete(int id)
		{
			var toDo = await _context.ToDos.FindAsync(id);

			if (toDo == null)
			{
				return NotFound();
			}

			toDo.StatusId = "closed"; // Assuming "closed" represents completed status
			await _context.SaveChangesAsync();

			return NoContent();
		}

		// DELETE: api/ToDo/DeleteTask
		[HttpDelete("Delete/{id}")]
		public async Task<IActionResult> DeleteTask(int id)
		{
			var task = await _context.ToDos.FindAsync(id);
			if (task != null)
			{				
				_context.Entry(task).State = EntityState.Deleted;
				_context.SaveChanges();
			}
			return NoContent();
		}

		// DELETE: api/ToDo/DeleteComplete
		[HttpDelete("DeleteComplete")]
		public async Task<IActionResult> DeleteComplete()
		{
			var completedToDos = await _context.ToDos.Where(t => t.StatusId == "closed").ToListAsync();

			_context.ToDos.RemoveRange(completedToDos);
			await _context.SaveChangesAsync();

			return NoContent();
		}

		private bool ToDoExists(int id)
		{
			return _context.ToDos.Any(e => e.Id == id);
		}
	}
}
