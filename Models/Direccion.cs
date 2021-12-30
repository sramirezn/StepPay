namespace StepPay.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Direccion")]
    public partial class Direccion
    {
        [Key]
        public int IDDireccion { get; set; }

        public int? IDCliente { get; set; }

        public int? NvTipo_Direccion { get; set; }

        [Column("Direccion")]
        [StringLength(150)]
        public string Direccion1 { get; set; }

        [StringLength(150)]
        public string Sector { get; set; }

        [StringLength(50)]
        public string Ciudad { get; set; }

        [StringLength(50)]
        public string Provincia { get; set; }

        [StringLength(100)]
        public string Pais { get; set; }

        [StringLength(10)]
        public string Codigo_Postal { get; set; }

        public bool? Por_Defecto { get; set; }

        public bool? Esta_Eliminado { get; set; }

        public DateTime? Fecha_Creacion { get; set; }

        public DateTime? Fecha_Actualizacion { get; set; }
    }
}
