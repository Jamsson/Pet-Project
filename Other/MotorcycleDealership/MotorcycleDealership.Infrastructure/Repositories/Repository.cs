using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace MotorcycleDealership.Application.Interfaces
{
    public class Repository<T> : IRepository<T> where T : class
    {
        private readonly DbContext _context;
        private readonly DbSet<T> _dbSet;

        public Repository(DbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _dbSet = _context.Set<T>();
        }

        public Task<IQueryable<T>> GetAllAsync(CancellationToken cancellationToken)
        {
            return Task.FromResult((IQueryable<T>)_dbSet);

        }

        public Task<IQueryable<T>> FindAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken)
        {
            return Task.FromResult(_dbSet.Where(predicate));
        }

        public Task AddAsync(T entity, CancellationToken cancellationToken)
        {
            _dbSet.Add(entity);
            return _context.SaveChangesAsync(cancellationToken);
        }

        public Task RemoveAsync(T entity, CancellationToken cancellationToken)
        {
            _dbSet.Remove(entity);
            return _context.SaveChangesAsync(cancellationToken);
        }
        
        public async Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken)
        {
            return await _context.Set<T>().FirstOrDefaultAsync(predicate);
        }

    }
}

