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
    public class ClienteController : Controller
    {
        private ISecurityRepository dbSecurity = new SecurityRepository();
        // GET: Cliente
        public async Task<ActionResult> Index(string fullName, string id, int? page, int? pageSize)
        {
            pageSize = pageSize ?? 10;

            ViewBag.PageSize = new SelectList((await dbSecurity.Getgrupo("Tamaño de paginacion")).OrderBy(a => Convert.ToInt32(a.CustomInt1)), "CustomInt1", "CustomInt1", pageSize.ToString());
            ViewBag.PageSizeNumber = pageSize;
            ViewBag.FilterFulName = fullName;
            ViewBag.FilterId = id;
        
          
            if (TempData["listo"] != null)
                ViewBag.listo = TempData["listo"];

            return View(dbSecurity.GetClients(fullName, id, page, (int)pageSize));
        }


        // GET: Clientes/Create
        public async Task<ActionResult> Create()
        {

            ViewBag.IDEmpresa = new SelectList((await dbSecurity.Getgrupo("Estados")).OrderBy(a => Convert.ToInt32(a.CustomInt1)), "CustomInt1", "Descripcion", 1);
            ViewBag.nvTipoIdentificacion= new SelectList((await dbSecurity.Getgrupo("Identificacion")).OrderBy(a => Convert.ToInt32(a.CustomInt1)), "CustomInt1", "Descripcion", 1);
           
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> Create([Bind(Include = "Numero_Identificacion,NvTipo_Identificacion,Nombre,Apellido,Correo_Electronico, IDEmpresa,Celular")] Cliente cliente)
        {
          

            if (TryValidateModel(cliente))
            {
                if (await dbSecurity.SaveClient(cliente))
                    ViewBag.listo = "El Registro ha sido grabado correctamente.";
                else
                    ViewBag.Error = "Se ha producido un error en el sistema. Favor intentelo mas tarde.";
            }

            ViewBag.IDEmpresa = new SelectList((await dbSecurity.Getgrupo("Estados")).OrderBy(a => Convert.ToInt32(a.CustomInt1)), "CustomInt1", "Descripcion", 1);
            ViewBag.nvTipoIdentificacion = new SelectList((await dbSecurity.Getgrupo("Identificacion")).OrderBy(a => Convert.ToInt32(a.CustomInt1)), "CustomInt1", "Descripcion", 1);
            return View(cliente);
        }




        public async Task<ActionResult> Edit(int id)
        {
            try
            {
                if (id == 0)
                    return new HttpStatusCodeResult(HttpStatusCode.BadRequest);

                Cliente cliente = await dbSecurity.GetClient(id);
                if (cliente == null)
                    return HttpNotFound();

                ViewBag.IDEmpresa = new SelectList((await dbSecurity.Getgrupo("Estados")).OrderBy(a => Convert.ToInt32(a.CustomInt1)), "CustomInt1", "Descripcion", cliente.IDEmpresa);
                ViewBag.nvTipoIdentificacion = (await dbSecurity.GetNameValueAsync("Identificacion", cliente.NvTipo_Identificacion.ToString())).Descripcion;
                ViewBag.clientWithAddress = await dbSecurity.GetClientWithAddress(id);



                return View(cliente);
            }
            catch (Exception)
            {

                throw;
            }



        }



        [HttpPost]

        public async Task<ActionResult> Edit([Bind(Include = "Numero_Identificacion,NvTipo_Identificacion,Nombre,Apellido,Correo_Electronico, IDEmpresa,Celular")] Cliente cliente, int Id)
        {
            if (Id != 0)
            {
                if (ModelState.IsValid)
                {
                    if (await dbSecurity.UpdateClient(Id, cliente))
                    {
                        ViewBag.IDEmpresa = new SelectList((await dbSecurity.Getgrupo("Estados")).OrderBy(a => Convert.ToInt32(a.CustomInt1)), "CustomInt1", "Descripcion", cliente.IDEmpresa);
                        TempData["listo"] = "El Registro ha sido actualizado correctamente.";
                        return RedirectToAction("Index");
                    }
                    else
                    {
                        return new HttpStatusCodeResult(HttpStatusCode.InternalServerError);
                    }
                }
            }
            else
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

          
            return View(cliente);
        }


       
    }
}


