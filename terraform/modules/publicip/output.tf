output "public_ip_address_id" {
  value = azurerm_public_ip.test.id
}
output "vm_public_ip_address_id" {
  value = azurerm_public_ip.vm_public_ip.id
}