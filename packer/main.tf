provider "azurerm" {
  features {}
}
resource "azurerm_resource_group" "AzureDevops" {
  name     = "AzureDevOps"
  location = "East US"
}