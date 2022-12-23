data "azurerm_image" "search" {
  name                = "azuredevops"
  resource_group_name = "Azuredevops"
}

resource "azurerm_network_interface" "vm_nic" {
  name                = "${var.application_type}-nic"
  location            = var.location
  resource_group_name = var.resource_group

  ip_configuration {
    name                          = "internal"
    subnet_id                     = var.subnet_id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = var.vm_public_ip
  }
}
resource "azurerm_linux_virtual_machine" "vm" {
  name                = "${var.application_type}-vm"
  location            = var.location
  resource_group_name = var.resource_group
  size                = "Standard_B1s"
  admin_username      = "udacityadmin"
  source_image_id     = data.azurerm_image.search.id

  network_interface_ids = [
    azurerm_network_interface.vm_nic.id
  ]
  admin_ssh_key {
    username   = "udacityadmin"
    public_key = file("./id_rsa.pub")
  }
  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }
}
