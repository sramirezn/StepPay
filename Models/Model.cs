namespace StepPay.Models
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class Model : DbContext
    {
        public Model()
            : base("name=Model")
        {
        }

        public virtual DbSet<Cliente> Clientes { get; set; }
        public virtual DbSet<Direccion> Direccions { get; set; }
        public virtual DbSet<NameValue> NameValues { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Cliente>()
                .Property(e => e.Numero_Identificacion)
                .IsUnicode(false);

            modelBuilder.Entity<Cliente>()
                .Property(e => e.Nombre)
                .IsUnicode(false);

            modelBuilder.Entity<Cliente>()
                .Property(e => e.Apellido)
                .IsUnicode(false);

            modelBuilder.Entity<Cliente>()
                .Property(e => e.Sexo)
                .IsFixedLength()
                .IsUnicode(false);

            modelBuilder.Entity<Cliente>()
                .Property(e => e.Celular)
                .IsUnicode(false);

            modelBuilder.Entity<Cliente>()
                .Property(e => e.TelCasa)
                .IsUnicode(false);

            modelBuilder.Entity<Cliente>()
                .Property(e => e.Correo_Electronico)
                .IsUnicode(false);
        }
    }
}
