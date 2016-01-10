using System;
using System.Collections.Generic;
using System.Linq;
using System.Data.Entity;
using fitotrack.Entity.Models;
using fitotrack.Data;
using System.Linq.Expressions;

namespace fitotrack.Repository.Generic
{
  public class GenericRepo<TEntity> : IGenericRepo<TEntity>
      where TEntity : class
  {
    internal FitotrackContext context;
    internal DbSet<TEntity> dbSet;

    public GenericRepo(FitotrackContext context)
    {
      this.context = context;
      this.dbSet = context.Set<TEntity>();
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="entity"></param>
    public void Attach(TEntity entity)
    {
      dbSet.Attach(entity);
    }

    public void Detach(TEntity entity)
    {
      context.Entry(entity).State = EntityState.Detached;
    }

    /// <summary>
    /// Получение данных из БД по критериям.
    /// </summary>
    /// <param name="filter">Фильтр. Лямбда-выражение.</param>
    /// <param name="orderBy">Сортировка. Лямбда-выражение.</param>
    /// <param name="includeProperties">Свойства, которые должны быть включены в ответе.</param>
    /// <returns>Перечисление данных из БД, соответствующих критериям.</returns>
    public virtual IEnumerable<TEntity> Get(
        Expression<Func<TEntity, bool>> filter = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
        params Expression<Func<TEntity, object>>[] includeProperties)
    {
      IQueryable<TEntity> query = dbSet;

      if (filter != null)
      {
        query = query.Where(filter);
      }

      foreach (var includeProperty in includeProperties)
      {
        query = query.Include(includeProperty);
      }

      if (orderBy != null)
      {
        return orderBy(query).ToList();
      }
      else
      {
        return query.ToList();
      }
    }

    /// <summary>
    /// Получение сущности из БД по идентификатору.
    /// </summary>
    /// <param name="id">Идентификатор сущности.</param>
    /// <returns>Сущность соответствующая идентификатору.</returns>
    public virtual TEntity GetByID(object id)
    {
      return dbSet.Find(id);
    }

    /// <summary>
    /// Добавление сущности в БД.
    /// </summary>
    /// <param name="entity">Добавляемая сущность.</param>
    public virtual void Insert(TEntity entity)
    {
      dbSet.Add(entity);
    }

    /// <summary>
    /// Удаление сущности из БД по идентфикатору.
    /// </summary>
    /// <param name="id">Идентификатор удаляемой сущности.</param>
    public virtual void Delete(object id)
    {
      TEntity entityToDelete = dbSet.Find(id);
      Delete(entityToDelete);
    }

    /// <summary>
    /// Удаление сущности из БД.
    /// </summary>
    /// <param name="entityToDelete">Удаляемая сущность.</param>
    public virtual void Delete(TEntity entityToDelete)
    {
      if (context.Entry(entityToDelete).State == EntityState.Detached)
      {
        dbSet.Attach(entityToDelete);
      }
      dbSet.Remove(entityToDelete);
    }

    /// <summary>
    /// Обновление сущности в БД. 
    /// </summary>
    /// <param name="entityToUpdate">Обновляемая сущность.</param>
    public virtual void Update(TEntity entityToUpdate)
    {
      dbSet.Attach(entityToUpdate);
      context.Entry(entityToUpdate).State = EntityState.Modified;
    }

    /// <summary>
    /// Добавление или Обновление сущности, в зависимости от идентификатора. Если id = 0 - Добавление, иначе - Обновление. 
    /// </summary>
    /// <param name="entity">Сущность.</param>
    /// <param name="id">Идентификатор сущности.</param>
    public virtual void InsertOrUpdate(TEntity entity, int entityId)
    {
      if (entityId == default(int))
      {
        // New entity
        dbSet.Add(entity);
      }
      else
      {
        // Existing entity
        dbSet.Attach(entity);
        context.Entry(entity).State = EntityState.Modified;
      }
    }
  }
}