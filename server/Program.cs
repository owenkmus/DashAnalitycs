using FinancialAnalytics.Server.Data;
using FinancialAnalytics.Server.Hubs;
using FinancialAnalytics.Server.Models;
using FinancialAnalytics.Server.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database - Switched to SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Identity
builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

// Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidAudience = builder.Configuration["Jwt:ValidAudience"],
        ValidIssuer = builder.Configuration["Jwt:ValidIssuer"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"] ?? "DefaultSecretKey12345678901234567890"))
    };
});

// SignalR
builder.Services.AddSignalR();

// Services
builder.Services.AddScoped<IKpiService, KpiService>();
builder.Services.AddHostedService<MetricsSimulator>();

// CORS - More permissive for debugging
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.SetIsOriginAllowed(_ => true)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<MetricsHub>("/hubs/metrics");

// Seed database
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<AppDbContext>();
    if (context.Database.EnsureCreated())
    {
        SeedData(context);
    }
}

app.Run();

void SeedData(AppDbContext context)
{
    if (context.Transactions.Any()) return;

    var random = new Random();
    var categories = new[] { "Nómina", "Marketing", "Tecnología", "Operaciones", "Legal", "Ventas" };
    var transactions = new List<Transaction>();

    for (int i = 0; i < 500; i++)
    {
        var isRevenue = random.Next(100) > 40;
        var date = DateTime.Now.AddDays(-random.Next(365));
        
        transactions.Add(new Transaction
        {
            Date = date,
            Type = isRevenue ? "Revenue" : "Expense",
            Category = isRevenue ? "Ventas" : categories[random.Next(categories.Length)],
            Amount = isRevenue ? random.Next(1000, 5000) : random.Next(200, 1500),
            Description = $"Transacción de prueba {i}"
        });
    }

    context.Transactions.AddRange(transactions);
    context.SaveChanges();
}
