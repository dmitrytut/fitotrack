using System;
using System.Linq;
using System.Collections.Generic;
using fitotrack.Entity.Models;
using System.Linq.Expressions;

namespace fitotrack.Repository.Generic
{
	/// <summary>
	/// Интерфейс IGenericRepo общего репозитория
	/// </summary>
  public interface IGenericRepo<TEntity>
  {
    IEnumerable<TEntity> Get(
        Expression<Func<TEntity, bool>> filter,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy,
        params Expression<Func<TEntity, object>>[] includeProperties
    );
    TEntity GetByID(object id);
    void Attach(TEntity entity);
    void Detach(TEntity entity);
    void Insert(TEntity entity);
    void Delete(object id);
    void Delete(TEntity entityToDelete);
    void Update(TEntity entityToUpdate);
    void InsertOrUpdate(TEntity entity, int entityId);
  }
}