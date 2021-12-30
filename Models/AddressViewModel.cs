using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace StepPay.Models
{
    public class AddressViewModel
    {
       public int IDCliente { get; set; }
        public string NumeroIdentificacion { get; set; }
        public int NVTipo_Direccion { get; set; }

        [StringLength(150), Required(ErrorMessage = "El campo {0} es requerido.")]
        public string Direccion { get; set; }

        [StringLength(150), Required(ErrorMessage = "El campo {0} es requerido.")]
        public string Sector { get; set; }

        public int NvPais { get; set; }

        [StringLength(50), Required(ErrorMessage = "El campo {0} es requerido.")]
        public string Ciudad { get; set; }

        [StringLength(50), Required(ErrorMessage = "El campo {0} es requerido.")]
        public string EstadoProvinciaRegion { get; set; }

        [StringLength(10)]
        public string CodigoPostal { get; set; }

        public bool IsDefault { get; set; }
    }
}