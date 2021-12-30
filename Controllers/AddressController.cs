using Dal;
using StepPay.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace StepPay.Controllers
{
    public class AddressController : Controller
    {
        private ISecurityRepository dbSecurity = new SecurityRepository();
        public ActionResult AddAddress(string clientId)
        {
            // ViewBag.clientId = clientId;
            return PartialView("_AddAddress", new AddressViewModel { NumeroIdentificacion = clientId });
        }

        [HttpPost]
        public async Task<JsonResult> AddAddress(AddressViewModel address)
        {
            if (ModelState.IsValid)
            {
                var response = await dbSecurity.AddAddress(address);

                if (response.Result)
                {
                    response.Entity.Reverse();
                    return Json(response.Entity.Select(d => new { AddressID = d.IDDireccion, IsDefault = d.Por_Defecto, Address = d.ToString()}));
                }
                else
                {
                    Response.StatusCode = response.StatusCode;
                    return Json(response.ErrorMessage);
                }
            }

            Response.StatusCode = 400;
            return Json(ModelState.Values);
        }
        public async Task<ActionResult> Edit(int addressID, int clientID)
        {
            var address = await dbSecurity.GetClientAddress(clientID, addressID);
            if (address != null)
            {
                ViewBag.AddressID = addressID;
                return PartialView("_Edit", new AddressViewModel()
                {
                    Ciudad = address.Ciudad,
                    CodigoPostal = address.Codigo_Postal,
                    Direccion = address.Direccion1,
                    Sector = address.Sector,
                    EstadoProvinciaRegion = address.Provincia,
                    IDCliente = address.IDCliente.Value,
                    IsDefault = address.Por_Defecto.Value,
                    NvPais = Convert.ToInt32(address.Pais),
                    NVTipo_Direccion = address.NvTipo_Direccion.Value
                });
            }

            return new HttpStatusCodeResult(HttpStatusCode.NotFound);
        }



        [HttpPost]
        public async Task<JsonResult> Edit(int addressID, AddressViewModel address)
        {
           

            if (ModelState.IsValid)
            {
                var response = await dbSecurity.EditAddress(addressID, address);

                if (response.Result)
                {
                    response.Entity = await dbSecurity.GetClientAddresses(address.IDCliente);
                    response.Entity.Reverse();
                    ViewBag.clientWithAddress = await dbSecurity.GetClientWithAddress(address.IDCliente);
                    return Json(response.Entity.Select(d => new { AddressID = d.IDDireccion, IsDefault = d.Por_Defecto, Address = d.ToString() }));
                  
                }
                else
                {
                    Response.StatusCode = response.StatusCode;
                    return Json(response.ErrorMessage);
                }
            }

            Response.StatusCode = 400;
            return Json(ModelState.Values);
        }
        [HttpPost]
        public async Task<JsonResult> Delete(int clientID, int addressID)
        {
            if (Session["clientID"] == null || Convert.ToInt32(Session["clientID"]) != clientID)
            {
                Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                return Json(null);
            }

            var response = await dbSecurity.DeleteAddressToClient(clientID, addressID);
            if (response.Result)
            {
                var address = await dbSecurity.GetClientAddresses(clientID);
                address.Reverse();
                return Json(address.Select(d => new { AddressID = d.IDDireccion, IsDefault = d.Por_Defecto, Address = d.ToString() }));
            }
            else
            {
                Response.StatusCode = response.StatusCode;
                return Json(response.ErrorMessage);
            }
        }
    }
}