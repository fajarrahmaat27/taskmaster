// 'using' berfungsi untuk memanggil alat-alat (library) yang kita butuhkan.
using Microsoft.EntityFrameworkCore;
using TaskMasterAPI.Models;



namespace TaskMasterAPI.Data
{
    // Class kita 'AppDbContext' mewarisi (Inheritance) kemampuan dari 'DbContext'.
    // DbContext adalah alat bawaan Microsoft untuk ngobrol dengan database.
    public class AppDbContext : DbContext
    {
        // Ini adalah Constructor. Ia menerima pengaturan (seperti alamat/password 
        // database dari appsettings.json) dan meneruskannya ke sistem utama (base).
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // DbSet ini sangat krusial! 
        // Perintah ini memberitahu sistem: "Ambil blueprint TodoItem, 
        // lalu buatkan tabel di database dan beri nama TodoItems."
        public DbSet<TodoItem> TodoItems { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Setiap User punya banyak TodoItems, dan setiap TodoItem punya satu User
            modelBuilder.Entity<User>()
                .HasMany(u => u.TodoItems)
                .WithOne(t => t.User)
                .HasForeignKey(t => t.UserId);
        }
    }
    
}