using GanihuhStack.Domain.Constants;
using GanihuhStack.Infrastructure.Identity;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace GanihuhStack.Infrastructure.Data;

public static class InitialiserExtensions
{
    public static async Task InitialiseDatabaseAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var initialiser = scope.ServiceProvider.GetRequiredService<ApplicationDbContextInitialiser>();
        await initialiser.InitialiseAsync();
        await initialiser.SeedAsync();
    }
}

public class ApplicationDbContextInitialiser
{
    private readonly ILogger<ApplicationDbContextInitialiser> _logger;
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;

    public ApplicationDbContextInitialiser(
        ILogger<ApplicationDbContextInitialiser> logger,
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager)
    {
        _logger = logger;
        _context = context;
        _userManager = userManager;
        _roleManager = roleManager;
    }

    public async Task InitialiseAsync()
    {
        try
        {
            await _context.Database.MigrateAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while initialising the database.");
            throw;
        }
    }

    public async Task SeedAsync()
    {
        try
        {
            await TrySeedAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while seeding the database.");
            throw;
        }
    }

    public async Task TrySeedAsync()
    {
        var administratorRole = new IdentityRole(Roles.Administrator);
        if (_roleManager.Roles.All(r => r.Name != administratorRole.Name))
            await _roleManager.CreateAsync(administratorRole);

        var administrator = new ApplicationUser { UserName = "admin@ganihuhstack.com", Email = "admin@ganihuhstack.com" };
        if (_userManager.Users.All(u => u.UserName != administrator.UserName))
        {
            await _userManager.CreateAsync(administrator, "Admin123!");
            if (!string.IsNullOrWhiteSpace(administratorRole.Name))
                await _userManager.AddToRolesAsync(administrator, [administratorRole.Name]);
        }

        if (!_context.BlogPosts.Any(b => b.IsPublished))
        {
            _context.BlogPosts.AddRange(
                new BlogPost
                {
                    Title = "Kenapa saya berhenti mengejar microservices",
                    Slug = "kenapa-saya-berhenti-mengejar-microservices",
                    Excerpt = "Modular monolith memberi 90% manfaat microservices tanpa 90% rasa sakitnya. Catatan dari memecah satu domain besar.",
                    Tags = "Arsitektur,Backend",
                    IsPublished = true,
                    PublishedDate = DateTimeOffset.UtcNow.AddDays(-12),
                    Content = """
                        Beberapa tahun lalu saya yakin setiap sistem serius harus dipecah jadi microservices. Sekarang saya berpikir sebaliknya: kebanyakan tim mengadopsinya terlalu dini, dan membayar ongkos operasional yang besar untuk masalah yang belum mereka punya.

                        Batas itu murah, jaringan itu mahal.

                        Modular monolith memberi batas domain yang tegas — modul tidak boleh saling memanggil sembarangan — tanpa memindahkan setiap panggilan fungsi ke jaringan. Anda mendapat keterpisahan logis tanpa kompleksitas distribusi.

                        Ketika satu modul benar-benar perlu diskalakan terpisah, batas yang sudah tegas tadi membuat ekstraksi jadi pekerjaan setengah hari, bukan setengah tahun. Anda menunda keputusan sampai punya data, bukan menebak di awal.

                        Pelajaran yang saya ambil: mulai dengan modul yang bersih, bukan layanan yang terpisah. Pisahkan ketika ada tekanan nyata — bukan ketika ada rasa takut bahwa nanti tidak bisa.
                        """
                },
                new BlogPost
                {
                    Title = "Test yang mensimulasikan kegagalan, bukan happy path",
                    Slug = "test-yang-mensimulasikan-kegagalan",
                    Excerpt = "Test yang cuma menguji kondisi ideal memberi rasa aman palsu. Bagaimana saya menulis test untuk timeout dan partisi jaringan.",
                    Tags = "Pengujian,Backend",
                    IsPublished = true,
                    PublishedDate = DateTimeOffset.UtcNow.AddDays(-27),
                    Content = """
                        Saya pernah punya test suite dengan coverage 90% yang tetap membiarkan bug lolos ke production. Masalahnya bukan jumlah test — tapi semua test menguji kondisi ideal.

                        Happy path adalah skenario yang paling jarang terjadi di dunia nyata.

                        Jaringan putus. Database lambat tiba-tiba. Payload datang terpotong. Third-party API mengembalikan 500 tanpa pesan. Kondisi inilah yang perlu diuji, bukan hanya "kalau semuanya berjalan mulus, hasilnya benar."

                        Cara praktis yang saya terapkan: untuk setiap external call, tulis minimal satu test yang mensimulasikan kegagalannya. Timeout, koneksi ditolak, respons malformed. Biarkan test itu membuktikan bahwa sistem gagal dengan baik — bukan crash diam-diam.

                        Test yang membuat Anda tidur nyenyak bukan yang menguji bahwa semuanya bekerja. Tapi yang membuktikan bahwa ketika rusak, rusaknya terkendali.
                        """
                },
                new BlogPost
                {
                    Title = "Kenapa saya menulis commit message panjang",
                    Slug = "kenapa-saya-menulis-commit-message-panjang",
                    Excerpt = "Commit message adalah surat untuk diri sendiri enam bulan ke depan. Sedikit usaha sekarang, banyak waktu terselamatkan nanti.",
                    Tags = "Kebiasaan",
                    IsPublished = true,
                    PublishedDate = DateTimeOffset.UtcNow.AddDays(-45),
                    Content = """
                        Dulu saya menulis commit message seperti kebanyakan orang: "fix bug", "update", "wip". Cepat, tidak ada gesekan. Sampai suatu hari saya harus debugging regresi yang masuk enam bulan lalu dan tidak ada petunjuk sama sekali dari git log.

                        Commit message bukan untuk kamu sekarang. Untuk kamu yang bingung pukul 11 malam enam bulan lagi.

                        Format yang saya pakai sekarang: baris pertama berisi apa yang berubah (singkat, present tense). Lalu baris kosong. Lalu paragraf kenapa — konteks yang tidak terlihat dari diff: constraint bisnis yang memaksa keputusan ini, bug yang dipicu skenario tertentu, trade-off yang sengaja dipilih.

                        Tidak perlu panjang. Tiga sampai empat kalimat sudah cukup untuk menyelamatkan satu jam debugging di masa depan. Itu investasi dengan return yang sangat jelas.
                        """
                }
            );

            await _context.SaveChangesAsync(CancellationToken.None);
        }
    }
}

