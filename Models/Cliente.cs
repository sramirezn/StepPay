namespace StepPay.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Cliente")]
    public partial class Cliente
    {
        [Key]
        public int IDCliente { get; set; }

        public int? IDEmpresa { get; set; }

        public int? NvTipo_Identificacion { get; set; }

        [StringLength(50)]
        public string Numero_Identificacion { get; set; }

        [StringLength(120)]
        public string Nombre { get; set; }

        [StringLength(120)]
        public string Apellido { get; set; }

        [StringLength(1)]
        public string Sexo { get; set; }

        [StringLength(50)]
        public string Celular { get; set; }

        [StringLength(50)]
        public string TelCasa { get; set; }

        [Required]
        [StringLength(50)]
        public string Correo_Electronico { get; set; }

        public bool? Esta_Eliminado { get; set; }

        public DateTime? Fecha_Creacion { get; set; }

        public DateTime? Fecha_Actualizacion { get; set; }
    }
}
