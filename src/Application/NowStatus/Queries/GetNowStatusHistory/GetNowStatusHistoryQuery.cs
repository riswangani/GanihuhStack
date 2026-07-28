using GanihuhStack.Application.NowStatuses.Queries.GetCurrentNowStatus;

namespace GanihuhStack.Application.NowStatuses.Queries.GetNowStatusHistory;

// 1. Query — Instuksti MediatR untuk mengambil daftar riwayat status lampau
public record GetNowStatusHistoryQuery : IRequest<List<NowStatusDto>>;

// 2. Handler — Eksekutor kueri ke database EF Core
public class GetNowStatusHistoryQueryHandler : IRequestHandler<GetNowStatusHistoryQuery, List<NowStatusDto>>
{
    private readonly IApplicationDbContext _context; // Abstraksi EF Core DbContext
    private readonly IMapper _mapper; // AutoMapper

    public GetNowStatusHistoryQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    // Method Handle: Wajib dinamai 'Handle' sesuai kontrak IRequestHandler milik MediatR
    public async Task<List<NowStatusDto>> Handle(GetNowStatusHistoryQuery request, CancellationToken cancellationToken)
    {
        // EF Core mengeksekusi SQL:
        // .OrderByDescending(n => n.Created) = Mengurutkan status dari yang terbaru ke terlama
        // .Skip(1) = Melewati 1 status paling baru (karena status paling baru sudah dipakai sebagai "Fokus Utama" aktif)
        // .ProjectTo = Mengambil kolom DTO secara efisien
        return await _context.NowStatuses
            .OrderByDescending(n => n.Created)
            .Skip(1)
            .ProjectTo<NowStatusDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}
