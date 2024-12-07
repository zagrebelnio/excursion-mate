using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class Changepricetypetoint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "Price",
                table: "Excursions",
                type: "int",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(6,2)");

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.AlterColumn<decimal>(
                name: "Price",
                table: "Excursions",
                type: "decimal(6,2)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");
        }
    }
}
