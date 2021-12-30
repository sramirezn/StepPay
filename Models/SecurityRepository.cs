using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Validation;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using Newtonsoft.Json;
using Services.Models;
using PagedList;
using StepPay.Models;

namespace Dal
{
    public class SecurityRepository : ISecurityRepository, IDisposable
    {
        bool disposed = false;
        Model db = new Model();
     

        ~SecurityRepository()
        {
            this.Dispose(false);
        }

        #region NameValue
        
        public async Task<List<NameValue>> Getgrupo(string grupo = "Grupos")
        {
           
            var Grupos = await db.NameValues.Where(nv => nv.IDGroup == db.NameValues.FirstOrDefault(a => a.Descripcion.ToLower() == grupo.ToLower() && a.Isdeleted == false).IDNameValue && nv.Isdeleted == false).ToListAsync();
            return Grupos;
        }

        public async Task<NameValue> GetNameValueAsync(string grupo, string customInt1 = null)
        {
            try
            {
                var query = db.NameValues.Where(n => n.IDGroup == db.NameValues.FirstOrDefault(nm => nm.Descripcion == grupo).IDNameValue).AsQueryable();
                if (customInt1 != null)
                {
                    query = query.Where(q => q.CustomInt1 == customInt1);
                }

                return await query.FirstOrDefaultAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }
        #endregion

        #region Cliente


        public IPagedList<Cliente> GetClients(string fullName, string id, int? page, int pageSizeList)
        {
          
            IQueryable<Cliente> query=null;
            query = db.Clientes.Where(f => f.Esta_Eliminado == false).AsQueryable();

            if (!string.IsNullOrEmpty(fullName))
                query = query.Where(f => f.Nombre.ToLower().Contains(fullName.ToLower()));

            if (!string.IsNullOrEmpty(id))
                query = query.Where(c => c.Numero_Identificacion == id);

            if (query!=null)
             query = query.OrderBy(f => f.Nombre);


            int pageSize = pageSizeList;
            int pageNumber = (page ?? 1);
            return query.ToPagedList(pageNumber, pageSize);
        }

        public async Task<bool> SaveClient(Cliente cliente)
        {
            try
            {
                cliente.Fecha_Creacion = DateTime.Now;
                cliente.Esta_Eliminado = false;
                db.Clientes.Add(cliente);
                await db.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                throw;
            }
        }



        public async Task<bool> UpdateClient(int Id, Cliente cliente)
        {
            try
            {
                var clienteDB = await db.Clientes.FindAsync(Id);
                if (clienteDB != null)
                {
                    clienteDB.Nombre = cliente.Nombre;
                    clienteDB.Correo_Electronico = cliente.Correo_Electronico;
                    clienteDB.Celular = cliente.Celular;
                    clienteDB.Fecha_Actualizacion = DateTime.Now;
                  
                    clienteDB.IDEmpresa = cliente.IDEmpresa;

                    db.Entry(clienteDB).State = EntityState.Modified;
                    await db.SaveChangesAsync();
                    return true;
                }

                return false;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public async Task<Direccion> GetClientAddress(int clientID, int addressID)
        {
            return await db.Direccions.Where(d => d.IDDireccion == addressID && d.IDCliente == clientID).SingleOrDefaultAsync(); 
        }
        public IQueryable<Direccion> GetClientAddress(string numeroIdentificacion)
        {
            return from c in db.Clientes
                   join d in db.Direccions on c.IDCliente equals d.IDCliente
                   where c.Numero_Identificacion == numeroIdentificacion && d.Esta_Eliminado == false
                   select d;

        }
        public IQueryable<Direccion> GetClientAddress(int clientID)
        {
            return db.Direccions.Where(d => d.IDCliente == clientID);
        }
        public void AddAddress(Direccion address)
        {
            address.Fecha_Creacion = DateTime.Now;
            
            db.Direccions.Add(address);
        }


        public async Task<List<Direccion>> GetClientAddresses(int clientID)
        {
            return await GetClientAddress(clientID).OrderByDescending(d => d.Por_Defecto).ToListAsync();
        }
      
        public async Task<OperationResult<List<Direccion>>> AddAddress(AddressViewModel address)
        {
            try
            {
                Cliente cliente = db.Clientes.Where(c => c.Numero_Identificacion == address.NumeroIdentificacion).FirstOrDefault();
                if (cliente != null)
                {
                    if (address.IsDefault || await (GetClientAddress(cliente.IDCliente).Where(c => c.Por_Defecto == true).CountAsync()) == 0)
                    {
                        var defaultAddresses = await GetClientAddress(cliente.IDCliente).Where(c => c.Por_Defecto == true).ToListAsync();
                        foreach (var defaultAddress in defaultAddresses)
                        {
                            defaultAddress.Por_Defecto = false;
                        }

                        address.IsDefault = true;
                    }

                    AddAddress(
                        new Direccion
                        {
                            IDCliente = cliente.IDCliente,
                            Direccion1 = address.Direccion,
                            Sector = address.Sector,
                            Ciudad = address.Ciudad,
                            Provincia = address.EstadoProvinciaRegion,
                            Pais = address.NvPais.ToString(),
                            NvTipo_Direccion = address.NVTipo_Direccion,
                            Esta_Eliminado = false,
                            Por_Defecto = address.IsDefault,
                            Codigo_Postal = address.CodigoPostal
                        }
                    );

                    await db.SaveChangesAsync();

                    return new OperationResult<List<Direccion>>(true)
                    {
                        Entity = await GetClientAddresses(cliente.IDCliente)
                    };
                }
                else 
                {
                    return new OperationResult<List<Direccion>>(false)
                    {
                        StatusCode = 400,
                        ErrorMessage = "Cliente no existe"
                    };

                }
                    
              

             
            }
            catch (Exception e)
            {
                return new OperationResult<List<Direccion>>(false)
                {
                    StatusCode = 500,
                    ErrorMessage = e.Message
                };
            }

        }
        public async Task<OperationResult<Direccion>> DeleteAddressToClient(int clientID, int addressID)
        {
            try
            {
                var address = await GetClientAddress(clientID, addressID);
                if (address != null)
                {
                   
                     

                    if (address.Por_Defecto.HasValue && address.Por_Defecto.Value)
                    {
                        var newDefaultAddress = await GetClientAddress(clientID).OrderByDescending(d => d.Fecha_Creacion).FirstOrDefaultAsync(d => d.Por_Defecto != true);
                        if (newDefaultAddress != null)
                            newDefaultAddress.Por_Defecto = true;
                    }

                    db.Direccions.Remove(address);
                    await db.SaveChangesAsync();

                    return new OperationResult<Direccion>(true)
                    {
                        Entity = address
                    };
                }
                else
                {
                    return new OperationResult<Direccion>(false)
                    {
                        StatusCode = 404,
                        ErrorMessage = "Dirección no existe"
                    };
                }

            }
            catch (Exception ex)
            {
                return new OperationResult<Direccion>(false)
                {
                    StatusCode = 500,
                    ErrorMessage = ex.Message
                };
            }
        }

        public async Task<Cliente> GetClient(int id)
        {
           
          return await db.Clientes.SingleOrDefaultAsync(c => c.IDCliente == id);
        }



        public async Task<ClienteWithAddress> GetClientWithAddress(int clientID)
        {
            Cliente cliente = await GetClient(clientID);

            if (cliente != null)
            {
                List<Direccion> direcciones = await GetClientAddresses(clientID);
                return new ClienteWithAddress { Client = cliente, Addresses = direcciones };
            }
            return null;
        }

        public async Task<OperationResult<List<Direccion>>> EditAddress(int addressID, AddressViewModel address)
        {
            try
            {
                Cliente cliente = db.Clientes.Where(c => c.IDCliente == address.IDCliente).SingleOrDefault();
                if (cliente != null)
                  
                {
                    var addressDB = await db.Direccions.Where(d=>d.IDCliente==address.IDCliente &&d.IDDireccion== addressID).SingleOrDefaultAsync();

                    if (addressDB != null)
                    {
                        var defaultAddresses = await GetClientAddress(address.IDCliente).Where(c => c.Por_Defecto == true).ToListAsync();

                        if (address.IsDefault)
                        {
                            foreach (var defaultAddress in defaultAddresses)
                            {
                                defaultAddress.Por_Defecto = false;
                            }
                            addressDB.Por_Defecto = address.IsDefault;
                        }

                        addressDB.Direccion1 = address.Direccion;
                        addressDB.Sector = address.Sector;
                        addressDB.Ciudad = address.Ciudad;
                        addressDB.Provincia = address.EstadoProvinciaRegion;
                        addressDB.Pais = address.NvPais.ToString();
                        addressDB.NvTipo_Direccion = address.NVTipo_Direccion;
                        addressDB.Fecha_Actualizacion = DateTime.Now;
                        addressDB.Codigo_Postal = address.CodigoPostal;
                        // addressDB.IsDefault = address.IsDefault;

                        await db.SaveChangesAsync();

                        return new OperationResult<List<Direccion>>(true)
                        {

                        };
                    }
                    else
                        return new OperationResult<List<Direccion>>(false)
                        {
                            StatusCode = 400,
                            ErrorMessage = "    Dirección no existe"
                        };
                }

                return new OperationResult<List<Direccion>>(false)
                {
                    StatusCode = 400,
                    ErrorMessage = "Cliente no existe"
                };
            }
            catch (Exception e)
            {
                return new OperationResult<List<Direccion>>(false)
                {
                    StatusCode = 500,
                    ErrorMessage = e.Message
                };
            }

        }




        #endregion




        public virtual void Dispose()
        {
            this.Dispose(true);
            GC.SuppressFinalize(this);
        }
        //
        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    db.Dispose();
                }

                this.disposed = true;
            }
        }

    

      

     
    }
}
