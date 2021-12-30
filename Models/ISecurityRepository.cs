
using Services.Models;
using PagedList;
using StepPay.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Linq;

namespace Dal
{
    public interface ISecurityRepository
    {
        #region NameValue

        Task<List<NameValue>> Getgrupo(string grupo = "Grupos");
        Task<NameValue> GetNameValueAsync(string grupo, string customInt1 = null);
        #endregion

        #region Cliente
        IPagedList<Cliente> GetClients(string fullName, string id, int? page, int pageSizeList);
        Task<bool> SaveClient(Cliente cliente);
        Task<OperationResult<List<Direccion>>> AddAddress(AddressViewModel address);
        Task<Cliente> GetClient(int id);
        Task<bool> UpdateClient(int Id, Cliente cliente);
        Task<ClienteWithAddress> GetClientWithAddress(int clientID);
        Task<Direccion> GetClientAddress(int clientID, int addressID);
        Task<OperationResult<List<Direccion>>> EditAddress(int addressID, AddressViewModel address);
        Task<OperationResult<Direccion>> DeleteAddressToClient(int clientID, int addressID);

        Task<List<Direccion>> GetClientAddresses(int clientID);
     

        #endregion

    }
}